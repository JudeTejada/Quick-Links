import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/@tanstack/react-router.mjs";
import { u as useAuthActions } from "../_libs/@convex-dev/auth.mjs";
import { F as Field, a as FieldLabel, I as Input, n as notify } from "./input-fCQhDu6Q.mjs";
import { B as Button } from "./router-tLPzzNbq.mjs";
import { u as useConvexAuth } from "../_libs/convex.mjs";
import "../_libs/tiny-warning.mjs";
import "../_libs/@tanstack/router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/@tanstack/store.mjs";
import "../_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/@tanstack/react-store.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/is-network-error.mjs";
import "../_libs/@base-ui/react.mjs";
import "../_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_libs/@floating-ui/utils.mjs";
import "../_libs/tabbable.mjs";
import "../_libs/@floating-ui/react-dom.mjs";
import "../_libs/@floating-ui/dom.mjs";
import "../_libs/@floating-ui/core.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/lucide-react.mjs";
function SignIn() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = reactExports.useState("");
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      formData.set("redirectTo", "/");
      const result = await signIn("resend", formData);
      notify({
        status: "success",
        title: "Success",
        description: result.signingIn ? "You are now signed in." : "Check your email for a magic link to finish signing in."
      });
      setEmail("");
    } catch (error) {
      notify({
        status: "danger",
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Unable to send a magic link."
      });
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#d4e7d2] via-[#e2f0de] to-[#c7dcc5] p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl text-slate-900", children: "Welcome" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-slate-500", children: "Easily sign in using a magic link." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLogin, className: "mt-6 flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: "email", children: "Email address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "email",
            name: "email",
            placeholder: "johndoe@gmail.com",
            type: "email",
            value: email,
            onChange: (event) => setEmail(event.target.value),
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isLoading, children: isLoading ? "Signing in..." : "Sign in" })
    ] })
  ] }) }) });
}
function Login() {
  const {
    isLoading,
    isAuthenticated
  } = useConvexAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate({
        to: "/"
      });
    }
  }, [isAuthenticated, isLoading, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SignIn, {});
}
export {
  Login as component
};
