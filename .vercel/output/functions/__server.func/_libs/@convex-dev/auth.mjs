import { r as reactExports, j as jsxRuntimeExports } from "../react.mjs";
import { i as isNetworkError } from "../is-network-error.mjs";
import { C as ConvexHttpClient, a as ConvexProviderWithAuth } from "../convex.mjs";
const RETRY_BACKOFF = [500, 2e3];
const RETRY_JITTER = 100;
const ConvexAuthActionsContext = reactExports.createContext(void 0);
const ConvexAuthInternalContext = reactExports.createContext(void 0);
function useAuth() {
  return reactExports.useContext(ConvexAuthInternalContext);
}
const ConvexAuthTokenContext = reactExports.createContext(null);
const VERIFIER_STORAGE_KEY = "__convexAuthOAuthVerifier";
const JWT_STORAGE_KEY = "__convexAuthJWT";
const REFRESH_TOKEN_STORAGE_KEY = "__convexAuthRefreshToken";
const SERVER_STATE_FETCH_TIME_STORAGE_KEY = "__convexAuthServerStateFetchTime";
function AuthProvider({ client, serverState, onChange, shouldHandleCode, storage, storageNamespace, replaceURL, children }) {
  const token = reactExports.useRef(serverState?._state.token ?? null);
  const [isLoading, setIsLoading] = reactExports.useState(token.current === null);
  const [tokenState, setTokenState] = reactExports.useState(token.current);
  const verbose = client.verbose ?? false;
  const logVerbose = reactExports.useCallback((message) => {
    if (verbose) {
      console.debug(`${(/* @__PURE__ */ new Date()).toISOString()} ${message}`);
      client.logger?.logVerbose(message);
    }
  }, [verbose]);
  const { storageSet, storageGet, storageRemove, storageKey } = useNamespacedStorage(storage, storageNamespace);
  const [isRefreshingToken, setIsRefreshingToken] = reactExports.useState(false);
  const setToken = reactExports.useCallback(async (args) => {
    const wasAuthenticated = token.current !== null;
    let newToken;
    if (args.tokens === null) {
      token.current = null;
      if (args.shouldStore) {
        await storageRemove(JWT_STORAGE_KEY);
        await storageRemove(REFRESH_TOKEN_STORAGE_KEY);
      }
      newToken = null;
    } else {
      const { token: value } = args.tokens;
      token.current = value;
      if (args.shouldStore) {
        const { refreshToken } = args.tokens;
        await storageSet(JWT_STORAGE_KEY, value);
        await storageSet(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
      }
      newToken = value;
    }
    if (wasAuthenticated !== (newToken !== null)) {
      await onChange?.();
    }
    setTokenState(newToken);
    setIsLoading(false);
  }, [storageSet, storageRemove]);
  reactExports.useEffect(() => {
    const listener = async (e) => {
      if (isRefreshingToken) {
        e.preventDefault();
        const confirmationMessage = "Are you sure you want to leave? Your changes may not be saved.";
        e.returnValue = true;
        return confirmationMessage;
      }
    };
    browserAddEventListener("beforeunload", listener);
    return () => {
      browserRemoveEventListener("beforeunload", listener);
    };
  });
  reactExports.useEffect(() => {
    const listener = (event) => {
      void (async () => {
        if (event.storageArea !== storage) {
          return;
        }
        if (event.key === storageKey(JWT_STORAGE_KEY)) {
          const value = event.newValue;
          logVerbose(`synced access token, is null: ${value === null}`);
          await setToken({
            shouldStore: false,
            tokens: value === null ? null : { token: value }
          });
        }
      })();
    };
    browserAddEventListener("storage", listener);
    return () => browserRemoveEventListener("storage", listener);
  }, [setToken]);
  const verifyCode = reactExports.useCallback(async (args) => {
    let lastError;
    let retry = 0;
    while (retry < RETRY_BACKOFF.length) {
      try {
        return await client.unauthenticatedCall("auth:signIn", "code" in args ? { params: { code: args.code }, verifier: args.verifier } : args);
      } catch (e) {
        lastError = e;
        if (!isNetworkError(e)) {
          break;
        }
        const wait = RETRY_BACKOFF[retry] + RETRY_JITTER * Math.random();
        retry++;
        logVerbose(`verifyCode failed with network error, retry ${retry} of ${RETRY_BACKOFF.length} in ${wait}ms`);
        await new Promise((resolve) => setTimeout(resolve, wait));
      }
    }
    throw lastError;
  }, [client]);
  const verifyCodeAndSetToken = reactExports.useCallback(async (args) => {
    const { tokens } = await verifyCode(args);
    logVerbose(`retrieved tokens, is null: ${tokens === null}`);
    await setToken({ shouldStore: true, tokens: tokens ?? null });
    return tokens !== null;
  }, [client, setToken]);
  const signIn = reactExports.useCallback(async (provider, args) => {
    const params = args instanceof FormData ? Array.from(args.entries()).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {}) : args ?? {};
    const verifier = await storageGet(VERIFIER_STORAGE_KEY) ?? void 0;
    await storageRemove(VERIFIER_STORAGE_KEY);
    const result = await client.authenticatedCall("auth:signIn", { provider, params, verifier });
    if (result.redirect !== void 0) {
      const url = new URL(result.redirect);
      await storageSet(VERIFIER_STORAGE_KEY, result.verifier);
      if (navigator.product !== "ReactNative") {
        window.location.href = url.toString();
      }
      return { signingIn: false, redirect: url };
    } else if (result.tokens !== void 0) {
      const { tokens } = result;
      logVerbose(`signed in and got tokens, is null: ${tokens === null}`);
      await setToken({ shouldStore: true, tokens });
      return { signingIn: result.tokens !== null };
    }
    return { signingIn: false };
  }, [client, setToken, storageGet]);
  const signOut = reactExports.useCallback(async () => {
    try {
      await client.authenticatedCall("auth:signOut");
    } catch (error) {
    }
    logVerbose(`signed out, erasing tokens`);
    await setToken({ shouldStore: true, tokens: null });
  }, [setToken, client]);
  const fetchAccessToken = reactExports.useCallback(async ({ forceRefreshToken }) => {
    if (forceRefreshToken) {
      const tokenBeforeLockAquisition = token.current;
      return await browserMutex(REFRESH_TOKEN_STORAGE_KEY, async () => {
        const tokenAfterLockAquisition = token.current;
        if (tokenAfterLockAquisition !== tokenBeforeLockAquisition) {
          logVerbose(`returning synced token, is null: ${tokenAfterLockAquisition === null}`);
          return tokenAfterLockAquisition;
        }
        const refreshToken = await storageGet(REFRESH_TOKEN_STORAGE_KEY) ?? null;
        if (refreshToken !== null) {
          setIsRefreshingToken(true);
          await verifyCodeAndSetToken({ refreshToken }).finally(() => {
            setIsRefreshingToken(false);
          });
          logVerbose(`returning retrieved token, is null: ${tokenAfterLockAquisition === null}`);
          return token.current;
        } else {
          setIsRefreshingToken(false);
          logVerbose(`returning null, there is no refresh token`);
          return null;
        }
      });
    }
    return token.current;
  }, [verifyCodeAndSetToken, signOut, storageGet]);
  const signingInWithCodeFromURL = reactExports.useRef(false);
  reactExports.useEffect(
    () => {
      if (storage === void 0) {
        throw new Error("`localStorage` is not available in this environment, set the `storage` prop on `ConvexAuthProvider`!");
      }
      const readStateFromStorage = async () => {
        const token2 = await storageGet(JWT_STORAGE_KEY) ?? null;
        logVerbose(`retrieved token from storage, is null: ${token2 === null}`);
        await setToken({
          shouldStore: false,
          tokens: token2 === null ? null : { token: token2 }
        });
      };
      if (serverState !== void 0) {
        const timeFetched = storageGet(SERVER_STATE_FETCH_TIME_STORAGE_KEY);
        const setTokensFromServerState = (timeFetched2) => {
          if (!timeFetched2 || serverState._timeFetched > +timeFetched2) {
            const { token: token2, refreshToken } = serverState._state;
            const tokens = token2 === null || refreshToken === null ? null : { token: token2, refreshToken };
            void storageSet(SERVER_STATE_FETCH_TIME_STORAGE_KEY, serverState._timeFetched.toString());
            void setToken({ tokens, shouldStore: true });
          } else {
            void readStateFromStorage();
          }
        };
        if (timeFetched instanceof Promise) {
          void timeFetched.then(setTokensFromServerState);
        } else {
          setTokensFromServerState(timeFetched);
        }
        return;
      }
      const code = typeof window?.location?.search !== "undefined" ? new URLSearchParams(window.location.search).get("code") : null;
      if ((signingInWithCodeFromURL.current || code) && !signingInWithCodeFromURL.current && (shouldHandleCode === void 0 || (typeof shouldHandleCode === "function" ? shouldHandleCode() : shouldHandleCode))) {
        signingInWithCodeFromURL.current = true;
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        void (async () => {
          await replaceURL(url.pathname + url.search + url.hash);
          await signIn(void 0, { code });
          signingInWithCodeFromURL.current = false;
        })();
      } else {
        void readStateFromStorage();
      }
    },
    // Explicitly chosen dependencies.
    // This effect should mostly only run once
    // on mount.
    [client, storageGet]
  );
  const actions = reactExports.useMemo(() => ({ signIn, signOut }), [signIn, signOut]);
  const isAuthenticated = tokenState !== null;
  const authState = reactExports.useMemo(() => ({
    isLoading,
    isAuthenticated,
    fetchAccessToken
  }), [fetchAccessToken, isLoading, isAuthenticated]);
  return jsxRuntimeExports.jsx(ConvexAuthInternalContext.Provider, { value: authState, children: jsxRuntimeExports.jsx(ConvexAuthActionsContext.Provider, { value: actions, children: jsxRuntimeExports.jsx(ConvexAuthTokenContext.Provider, { value: tokenState, children }) }) });
}
function useNamespacedStorage(peristentStorage, namespace) {
  const inMemoryStorage = useInMemoryStorage();
  const storage = reactExports.useMemo(() => peristentStorage ?? inMemoryStorage(), [peristentStorage]);
  const escapedNamespace = namespace.replace(/[^a-zA-Z0-9]/g, "");
  const storageKey = reactExports.useCallback((key) => `${key}_${escapedNamespace}`, [namespace]);
  const storageSet = reactExports.useCallback((key, value) => storage.setItem(storageKey(key), value), [storage, storageKey]);
  const storageGet = reactExports.useCallback((key) => storage.getItem(storageKey(key)), [storage, storageKey]);
  const storageRemove = reactExports.useCallback((key) => storage.removeItem(storageKey(key)), [storage, storageKey]);
  return { storageSet, storageGet, storageRemove, storageKey };
}
function useInMemoryStorage() {
  const [inMemoryStorage, setInMemoryStorage] = reactExports.useState({});
  return () => ({
    getItem: (key) => inMemoryStorage[key],
    setItem: (key, value) => {
      setInMemoryStorage((prev) => ({ ...prev, [key]: value }));
    },
    removeItem: (key) => {
      setInMemoryStorage((prev) => {
        const { [key]: _, ...rest } = prev;
        return rest;
      });
    }
  });
}
async function browserMutex(key, callback) {
  const lockManager = window?.navigator?.locks;
  return lockManager !== void 0 ? await lockManager.request(key, callback) : await manualMutex(key, callback);
}
function getMutexValue(key) {
  if (globalThis.__convexAuthMutexes === void 0) {
    globalThis.__convexAuthMutexes = {};
  }
  let mutex = globalThis.__convexAuthMutexes[key];
  if (mutex === void 0) {
    globalThis.__convexAuthMutexes[key] = {
      currentlyRunning: null,
      waiting: []
    };
  }
  mutex = globalThis.__convexAuthMutexes[key];
  return mutex;
}
function setMutexValue(key, value) {
  globalThis.__convexAuthMutexes[key] = value;
}
async function enqueueCallbackForMutex(key, callback) {
  const mutex = getMutexValue(key);
  if (mutex.currentlyRunning === null) {
    setMutexValue(key, {
      currentlyRunning: callback().finally(() => {
        const nextCb = getMutexValue(key).waiting.shift();
        getMutexValue(key).currentlyRunning = null;
        setMutexValue(key, {
          ...getMutexValue(key),
          currentlyRunning: nextCb === void 0 ? null : enqueueCallbackForMutex(key, nextCb)
        });
      }),
      waiting: []
    });
  } else {
    setMutexValue(key, {
      ...mutex,
      waiting: [...mutex.waiting, callback]
    });
  }
}
async function manualMutex(key, callback) {
  const outerPromise = new Promise((resolve, reject) => {
    const wrappedCallback = () => {
      return callback().then((v) => resolve(v)).catch((e) => reject(e));
    };
    void enqueueCallbackForMutex(key, wrappedCallback);
  });
  return outerPromise;
}
function browserAddEventListener(type, listener, options) {
  window.addEventListener?.(type, listener, options);
}
function browserRemoveEventListener(type, listener, options) {
  window.removeEventListener?.(type, listener, options);
}
function useAuthActions() {
  return reactExports.useContext(ConvexAuthActionsContext);
}
function ConvexAuthProvider(props) {
  const { client, storage, storageNamespace, replaceURL, shouldHandleCode, children } = props;
  const authClient = reactExports.useMemo(() => ({
    authenticatedCall(action, args) {
      return client.action(action, args);
    },
    unauthenticatedCall(action, args) {
      return new ConvexHttpClient(client.address, {
        logger: client.logger
      }).action(action, args);
    },
    verbose: client.options?.verbose,
    logger: client.logger
  }), [client]);
  return jsxRuntimeExports.jsx(AuthProvider, { client: authClient, storage: storage ?? // Handle SSR, RN, Web, etc.
  // Pretend we always have storage, the component checks
  // it in first useEffect.
  (typeof window === "undefined" ? void 0 : window?.localStorage), storageNamespace: storageNamespace ?? client.address, replaceURL: replaceURL ?? ((url) => {
    window.history.replaceState({}, "", url);
  }), shouldHandleCode, children: jsxRuntimeExports.jsx(ConvexProviderWithAuth, { client, useAuth, children }) });
}
export {
  ConvexAuthProvider as C,
  useAuthActions as u
};
