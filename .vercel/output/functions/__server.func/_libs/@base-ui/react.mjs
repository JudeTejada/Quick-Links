import { r as reactExports, j as jsxRuntimeExports } from "../react.mjs";
import { r as reactDomExports } from "../react-dom.mjs";
import { m as mergeObjects, E as EMPTY_OBJECT, u as useMergedRefs, a as useMergedRefsN, g as getReactElementRef, f as formatErrorMessage, i as isJSDOM, b as isAndroid, c as useStableCallback, d as generateId, T as Timeout, o as ownerDocument, e as useIsoLayoutEffect, h as isSafari, v as visuallyHidden, j as useAnimationFrame, k as inertValue, l as useId, n as useRefWithInit, p as useValueAsRef, q as useTimeout, R as ReactStore, r as createSelector, A as AnimationFrame, s as isMac, t as EMPTY_ARRAY, N as NOOP, w as useControlled, x as useOnMount, y as isIOS, z as useEnhancedClickHandler, B as useScrollLock, C as usePreviousValue } from "./utils.mjs";
import { i as isShadowRoot, a as isHTMLElement, f as floor, g as getWindow, b as getNodeName, c as isNode, d as getComputedStyle$1, e as isElement, h as isLastTraversableNode, j as getParentNode, k as getOverflowAncestors, l as isWebKit, m as evaluate, n as getPaddingObject, o as getAlignmentAxis, p as getAlignment, q as clamp, r as getAxisLength, s as getSide, t as getSideAxis, u as round } from "../@floating-ui/utils.mjs";
import { t as tabbable, i as isTabbable, f as focusable } from "../tabbable.mjs";
import { u as useFloating$1, h as hide$1, f as flip, o as offset, s as size, a as shift, l as limitShift } from "../@floating-ui/react-dom.mjs";
import { a as autoUpdate } from "../@floating-ui/dom.mjs";
const EMPTY_PROPS = {};
function mergeProps$1(a, b, c, d, e) {
  let merged = {
    ...resolvePropsGetter(a, EMPTY_PROPS)
  };
  if (b) {
    merged = mergeOne(merged, b);
  }
  if (c) {
    merged = mergeOne(merged, c);
  }
  if (d) {
    merged = mergeOne(merged, d);
  }
  return merged;
}
function mergePropsN(props) {
  if (props.length === 0) {
    return EMPTY_PROPS;
  }
  if (props.length === 1) {
    return resolvePropsGetter(props[0], EMPTY_PROPS);
  }
  let merged = {
    ...resolvePropsGetter(props[0], EMPTY_PROPS)
  };
  for (let i = 1; i < props.length; i += 1) {
    merged = mergeOne(merged, props[i]);
  }
  return merged;
}
function mergeOne(merged, inputProps) {
  if (isPropsGetter(inputProps)) {
    return inputProps(merged);
  }
  return mutablyMergeInto(merged, inputProps);
}
function mutablyMergeInto(mergedProps, externalProps) {
  if (!externalProps) {
    return mergedProps;
  }
  for (const propName in externalProps) {
    const externalPropValue = externalProps[propName];
    switch (propName) {
      case "style": {
        mergedProps[propName] = mergeObjects(mergedProps.style, externalPropValue);
        break;
      }
      case "className": {
        mergedProps[propName] = mergeClassNames(mergedProps.className, externalPropValue);
        break;
      }
      default: {
        if (isEventHandler(propName, externalPropValue)) {
          mergedProps[propName] = mergeEventHandlers(mergedProps[propName], externalPropValue);
        } else {
          mergedProps[propName] = externalPropValue;
        }
      }
    }
  }
  return mergedProps;
}
function isEventHandler(key, value) {
  const code0 = key.charCodeAt(0);
  const code1 = key.charCodeAt(1);
  const code2 = key.charCodeAt(2);
  return code0 === 111 && code1 === 110 && code2 >= 65 && code2 <= 90 && (typeof value === "function" || typeof value === "undefined");
}
function isPropsGetter(inputProps) {
  return typeof inputProps === "function";
}
function resolvePropsGetter(inputProps, previousProps) {
  if (isPropsGetter(inputProps)) {
    return inputProps(previousProps);
  }
  return inputProps ?? EMPTY_PROPS;
}
function mergeEventHandlers(ourHandler, theirHandler) {
  if (!theirHandler) {
    return ourHandler;
  }
  if (!ourHandler) {
    return theirHandler;
  }
  return (event) => {
    if (isSyntheticEvent(event)) {
      const baseUIEvent = event;
      makeEventPreventable(baseUIEvent);
      const result2 = theirHandler(baseUIEvent);
      if (!baseUIEvent.baseUIHandlerPrevented) {
        ourHandler?.(baseUIEvent);
      }
      return result2;
    }
    const result = theirHandler(event);
    ourHandler?.(event);
    return result;
  };
}
function makeEventPreventable(event) {
  event.preventBaseUIHandler = () => {
    event.baseUIHandlerPrevented = true;
  };
  return event;
}
function mergeClassNames(ourClassName, theirClassName) {
  if (theirClassName) {
    if (ourClassName) {
      return theirClassName + " " + ourClassName;
    }
    return theirClassName;
  }
  return ourClassName;
}
function isSyntheticEvent(event) {
  return event != null && typeof event === "object" && "nativeEvent" in event;
}
function getStateAttributesProps(state, customMapping) {
  const props = {};
  for (const key in state) {
    const value = state[key];
    if (customMapping?.hasOwnProperty(key)) {
      const customProps = customMapping[key](value);
      if (customProps != null) {
        Object.assign(props, customProps);
      }
      continue;
    }
    if (value === true) {
      props[`data-${key.toLowerCase()}`] = "";
    } else if (value) {
      props[`data-${key.toLowerCase()}`] = value.toString();
    }
  }
  return props;
}
function resolveClassName(className, state) {
  return typeof className === "function" ? className(state) : className;
}
function resolveStyle(style, state) {
  return typeof style === "function" ? style(state) : style;
}
const TYPEAHEAD_RESET_MS = 500;
const PATIENT_CLICK_THRESHOLD = 500;
const DISABLED_TRANSITIONS_STYLE = {
  style: {
    transition: "none"
  }
};
const CLICK_TRIGGER_IDENTIFIER = "data-base-ui-click-trigger";
const DROPDOWN_COLLISION_AVOIDANCE = {
  fallbackAxisSide: "none"
};
const POPUP_COLLISION_AVOIDANCE = {
  fallbackAxisSide: "end"
};
const ownerVisuallyHidden = {
  clipPath: "inset(50%)",
  position: "fixed",
  top: 0,
  left: 0
};
function useRenderElement(element, componentProps, params = {}) {
  const renderProp = componentProps.render;
  const outProps = useRenderElementProps(componentProps, params);
  if (params.enabled === false) {
    return null;
  }
  const state = params.state ?? EMPTY_OBJECT;
  return evaluateRenderProp(element, renderProp, outProps, state);
}
function useRenderElementProps(componentProps, params = {}) {
  const {
    className: classNameProp,
    style: styleProp,
    render: renderProp
  } = componentProps;
  const {
    state = EMPTY_OBJECT,
    ref,
    props,
    stateAttributesMapping: stateAttributesMapping2,
    enabled = true
  } = params;
  const className = enabled ? resolveClassName(classNameProp, state) : void 0;
  const style = enabled ? resolveStyle(styleProp, state) : void 0;
  const stateProps = enabled ? getStateAttributesProps(state, stateAttributesMapping2) : EMPTY_OBJECT;
  const outProps = enabled ? mergeObjects(stateProps, Array.isArray(props) ? mergePropsN(props) : props) ?? EMPTY_OBJECT : EMPTY_OBJECT;
  if (typeof document !== "undefined") {
    if (!enabled) {
      useMergedRefs(null, null);
    } else if (Array.isArray(ref)) {
      outProps.ref = useMergedRefsN([outProps.ref, getReactElementRef(renderProp), ...ref]);
    } else {
      outProps.ref = useMergedRefs(outProps.ref, getReactElementRef(renderProp), ref);
    }
  }
  if (!enabled) {
    return EMPTY_OBJECT;
  }
  if (className !== void 0) {
    outProps.className = mergeClassNames(outProps.className, className);
  }
  if (style !== void 0) {
    outProps.style = mergeObjects(outProps.style, style);
  }
  return outProps;
}
function evaluateRenderProp(element, render, props, state) {
  if (render) {
    if (typeof render === "function") {
      return render(props, state);
    }
    const mergedProps = mergeProps$1(props, render.props);
    mergedProps.ref = props.ref;
    return /* @__PURE__ */ reactExports.cloneElement(render, mergedProps);
  }
  if (element) {
    if (typeof element === "string") {
      return renderTag(element, props);
    }
  }
  throw new Error(formatErrorMessage(8));
}
function renderTag(Tag, props) {
  if (Tag === "button") {
    return /* @__PURE__ */ reactExports.createElement("button", {
      type: "button",
      ...props,
      key: props.key
    });
  }
  if (Tag === "img") {
    return /* @__PURE__ */ reactExports.createElement("img", {
      alt: "",
      ...props,
      key: props.key
    });
  }
  return /* @__PURE__ */ reactExports.createElement(Tag, props);
}
function useRender(params) {
  return useRenderElement(params.defaultTagName ?? "div", params, params);
}
const FOCUSABLE_ATTRIBUTE = "data-base-ui-focusable";
const ACTIVE_KEY = "active";
const SELECTED_KEY = "selected";
const TYPEABLE_SELECTOR = "input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";
const ARROW_LEFT$1 = "ArrowLeft";
const ARROW_RIGHT$1 = "ArrowRight";
const ARROW_UP$1 = "ArrowUp";
const ARROW_DOWN$1 = "ArrowDown";
function activeElement(doc) {
  let element = doc.activeElement;
  while (element?.shadowRoot?.activeElement != null) {
    element = element.shadowRoot.activeElement;
  }
  return element;
}
function contains(parent, child) {
  if (!parent || !child) {
    return false;
  }
  const rootNode = child.getRootNode?.();
  if (parent.contains(child)) {
    return true;
  }
  if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    while (next) {
      if (parent === next) {
        return true;
      }
      next = next.parentNode || next.host;
    }
  }
  return false;
}
function getTarget(event) {
  if ("composedPath" in event) {
    return event.composedPath()[0];
  }
  return event.target;
}
function isEventTargetWithin(event, node) {
  if (node == null) {
    return false;
  }
  if ("composedPath" in event) {
    return event.composedPath().includes(node);
  }
  const eventAgain = event;
  return eventAgain.target != null && node.contains(eventAgain.target);
}
function isRootElement(element) {
  return element.matches("html,body");
}
function getDocument(node) {
  return node?.ownerDocument || document;
}
function isTypeableElement(element) {
  return isHTMLElement(element) && element.matches(TYPEABLE_SELECTOR);
}
function isTypeableCombobox(element) {
  if (!element) {
    return false;
  }
  return element.getAttribute("role") === "combobox" && isTypeableElement(element);
}
function matchesFocusVisible(element) {
  if (!element || isJSDOM) {
    return true;
  }
  try {
    return element.matches(":focus-visible");
  } catch (_e) {
    return true;
  }
}
function getFloatingFocusElement(floatingElement) {
  if (!floatingElement) {
    return null;
  }
  return floatingElement.hasAttribute(FOCUSABLE_ATTRIBUTE) ? floatingElement : floatingElement.querySelector(`[${FOCUSABLE_ATTRIBUTE}]`) || floatingElement;
}
function getNodeChildren(nodes, id, onlyOpenChildren = true) {
  const directChildren = nodes.filter((node) => node.parentId === id && (!onlyOpenChildren || node.context?.open));
  return directChildren.flatMap((child) => [child, ...getNodeChildren(nodes, child.id, onlyOpenChildren)]);
}
function getNodeAncestors(nodes, id) {
  let allAncestors = [];
  let currentParentId = nodes.find((node) => node.id === id)?.parentId;
  while (currentParentId) {
    const currentNode = nodes.find((node) => node.id === currentParentId);
    currentParentId = currentNode?.parentId;
    if (currentNode) {
      allAncestors = allAncestors.concat(currentNode);
    }
  }
  return allAncestors;
}
function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}
function isReactEvent(event) {
  return "nativeEvent" in event;
}
function isVirtualClick(event) {
  if (event.mozInputSource === 0 && event.isTrusted) {
    return true;
  }
  if (isAndroid && event.pointerType) {
    return event.type === "click" && event.buttons === 1;
  }
  return event.detail === 0 && !event.pointerType;
}
function isVirtualPointerEvent(event) {
  if (isJSDOM) {
    return false;
  }
  return !isAndroid && event.width === 0 && event.height === 0 || isAndroid && event.width === 1 && event.height === 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === "mouse" || // iOS VoiceOver returns 0.333• for width/height.
  event.width < 1 && event.height < 1 && event.pressure === 0 && event.detail === 0 && event.pointerType === "touch";
}
function isMouseLikePointerType(pointerType, strict) {
  const values = ["mouse", "pen"];
  if (!strict) {
    values.push("", void 0);
  }
  return values.includes(pointerType);
}
function isClickLikeEvent(event) {
  const type = event.type;
  return type === "click" || type === "mousedown" || type === "keydown" || type === "keyup";
}
function isDifferentGridRow(index, cols, prevRow) {
  return Math.floor(index / cols) !== prevRow;
}
function isIndexOutOfListBounds(listRef, index) {
  return index < 0 || index >= listRef.current.length;
}
function getMinListIndex(listRef, disabledIndices) {
  return findNonDisabledListIndex(listRef, {
    disabledIndices
  });
}
function getMaxListIndex(listRef, disabledIndices) {
  return findNonDisabledListIndex(listRef, {
    decrement: true,
    startingIndex: listRef.current.length,
    disabledIndices
  });
}
function findNonDisabledListIndex(listRef, {
  startingIndex = -1,
  decrement = false,
  disabledIndices,
  amount = 1
} = {}) {
  let index = startingIndex;
  do {
    index += decrement ? -amount : amount;
  } while (index >= 0 && index <= listRef.current.length - 1 && isListIndexDisabled(listRef, index, disabledIndices));
  return index;
}
function getGridNavigatedIndex(listRef, {
  event,
  orientation,
  loopFocus,
  rtl,
  cols,
  disabledIndices,
  minIndex,
  maxIndex,
  prevIndex,
  stopEvent: stop = false
}) {
  let nextIndex = prevIndex;
  const rows = [];
  const rowIndexMap = {};
  let hasRoleRow = false;
  {
    let currentRowEl = null;
    let currentRowIndex = -1;
    listRef.current.forEach((el, idx) => {
      if (el == null) {
        return;
      }
      const rowEl = el.closest('[role="row"]');
      if (rowEl) {
        hasRoleRow = true;
      }
      if (rowEl !== currentRowEl || currentRowIndex === -1) {
        currentRowEl = rowEl;
        currentRowIndex += 1;
        rows[currentRowIndex] = [];
      }
      rows[currentRowIndex].push(idx);
      rowIndexMap[idx] = currentRowIndex;
    });
  }
  const hasDomRows = hasRoleRow && rows.length > 0 && rows.some((row) => row.length !== cols);
  function navigateVertically(direction) {
    if (!hasDomRows || prevIndex === -1) {
      return void 0;
    }
    const currentRow = rowIndexMap[prevIndex];
    if (currentRow == null) {
      return void 0;
    }
    const colInRow = rows[currentRow].indexOf(prevIndex);
    let nextRow = direction === "up" ? currentRow - 1 : currentRow + 1;
    if (loopFocus) {
      if (nextRow < 0) {
        nextRow = rows.length - 1;
      } else if (nextRow >= rows.length) {
        nextRow = 0;
      }
    }
    const visited = /* @__PURE__ */ new Set();
    while (nextRow >= 0 && nextRow < rows.length && !visited.has(nextRow)) {
      visited.add(nextRow);
      const targetRow = rows[nextRow];
      if (targetRow.length === 0) {
        nextRow = direction === "up" ? nextRow - 1 : nextRow + 1;
        continue;
      }
      const clampedCol = Math.min(colInRow, targetRow.length - 1);
      for (let col = clampedCol; col >= 0; col -= 1) {
        const candidate = targetRow[col];
        if (!isListIndexDisabled(listRef, candidate, disabledIndices)) {
          return candidate;
        }
      }
      nextRow = direction === "up" ? nextRow - 1 : nextRow + 1;
      if (loopFocus) {
        if (nextRow < 0) {
          nextRow = rows.length - 1;
        } else if (nextRow >= rows.length) {
          nextRow = 0;
        }
      }
    }
    return void 0;
  }
  if (event.key === ARROW_UP$1) {
    const domBasedCandidate = navigateVertically("up");
    if (domBasedCandidate !== void 0) {
      if (stop) {
        stopEvent(event);
      }
      nextIndex = domBasedCandidate;
    } else {
      if (stop) {
        stopEvent(event);
      }
      if (prevIndex === -1) {
        nextIndex = maxIndex;
      } else {
        nextIndex = findNonDisabledListIndex(listRef, {
          startingIndex: nextIndex,
          amount: cols,
          decrement: true,
          disabledIndices
        });
        if (loopFocus && (prevIndex - cols < minIndex || nextIndex < 0)) {
          const col = prevIndex % cols;
          const maxCol = maxIndex % cols;
          const offset2 = maxIndex - (maxCol - col);
          if (maxCol === col) {
            nextIndex = maxIndex;
          } else {
            nextIndex = maxCol > col ? offset2 : offset2 - cols;
          }
        }
      }
      if (isIndexOutOfListBounds(listRef, nextIndex)) {
        nextIndex = prevIndex;
      }
    }
  }
  if (event.key === ARROW_DOWN$1) {
    const domBasedCandidate = navigateVertically("down");
    if (domBasedCandidate !== void 0) {
      if (stop) {
        stopEvent(event);
      }
      nextIndex = domBasedCandidate;
    } else {
      if (stop) {
        stopEvent(event);
      }
      if (prevIndex === -1) {
        nextIndex = minIndex;
      } else {
        nextIndex = findNonDisabledListIndex(listRef, {
          startingIndex: prevIndex,
          amount: cols,
          disabledIndices
        });
        if (loopFocus && prevIndex + cols > maxIndex) {
          nextIndex = findNonDisabledListIndex(listRef, {
            startingIndex: prevIndex % cols - cols,
            amount: cols,
            disabledIndices
          });
        }
      }
      if (isIndexOutOfListBounds(listRef, nextIndex)) {
        nextIndex = prevIndex;
      }
    }
  }
  if (orientation === "both") {
    const prevRow = floor(prevIndex / cols);
    if (event.key === (rtl ? ARROW_LEFT$1 : ARROW_RIGHT$1)) {
      if (stop) {
        stopEvent(event);
      }
      if (prevIndex % cols !== cols - 1) {
        nextIndex = findNonDisabledListIndex(listRef, {
          startingIndex: prevIndex,
          disabledIndices
        });
        if (loopFocus && isDifferentGridRow(nextIndex, cols, prevRow)) {
          nextIndex = findNonDisabledListIndex(listRef, {
            startingIndex: prevIndex - prevIndex % cols - 1,
            disabledIndices
          });
        }
      } else if (loopFocus) {
        nextIndex = findNonDisabledListIndex(listRef, {
          startingIndex: prevIndex - prevIndex % cols - 1,
          disabledIndices
        });
      }
      if (isDifferentGridRow(nextIndex, cols, prevRow)) {
        nextIndex = prevIndex;
      }
    }
    if (event.key === (rtl ? ARROW_RIGHT$1 : ARROW_LEFT$1)) {
      if (stop) {
        stopEvent(event);
      }
      if (prevIndex % cols !== 0) {
        nextIndex = findNonDisabledListIndex(listRef, {
          startingIndex: prevIndex,
          decrement: true,
          disabledIndices
        });
        if (loopFocus && isDifferentGridRow(nextIndex, cols, prevRow)) {
          nextIndex = findNonDisabledListIndex(listRef, {
            startingIndex: prevIndex + (cols - prevIndex % cols),
            decrement: true,
            disabledIndices
          });
        }
      } else if (loopFocus) {
        nextIndex = findNonDisabledListIndex(listRef, {
          startingIndex: prevIndex + (cols - prevIndex % cols),
          decrement: true,
          disabledIndices
        });
      }
      if (isDifferentGridRow(nextIndex, cols, prevRow)) {
        nextIndex = prevIndex;
      }
    }
    const lastRow = floor(maxIndex / cols) === prevRow;
    if (isIndexOutOfListBounds(listRef, nextIndex)) {
      if (loopFocus && lastRow) {
        nextIndex = event.key === (rtl ? ARROW_RIGHT$1 : ARROW_LEFT$1) ? maxIndex : findNonDisabledListIndex(listRef, {
          startingIndex: prevIndex - prevIndex % cols - 1,
          disabledIndices
        });
      } else {
        nextIndex = prevIndex;
      }
    }
  }
  return nextIndex;
}
function createGridCellMap(sizes, cols, dense) {
  const cellMap = [];
  let startIndex = 0;
  sizes.forEach(({
    width,
    height
  }, index) => {
    let itemPlaced = false;
    if (dense) {
      startIndex = 0;
    }
    while (!itemPlaced) {
      const targetCells = [];
      for (let i = 0; i < width; i += 1) {
        for (let j = 0; j < height; j += 1) {
          targetCells.push(startIndex + i + j * cols);
        }
      }
      if (startIndex % cols + width <= cols && targetCells.every((cell) => cellMap[cell] == null)) {
        targetCells.forEach((cell) => {
          cellMap[cell] = index;
        });
        itemPlaced = true;
      } else {
        startIndex += 1;
      }
    }
  });
  return [...cellMap];
}
function getGridCellIndexOfCorner(index, sizes, cellMap, cols, corner) {
  if (index === -1) {
    return -1;
  }
  const firstCellIndex = cellMap.indexOf(index);
  const sizeItem = sizes[index];
  switch (corner) {
    case "tl":
      return firstCellIndex;
    case "tr":
      if (!sizeItem) {
        return firstCellIndex;
      }
      return firstCellIndex + sizeItem.width - 1;
    case "bl":
      if (!sizeItem) {
        return firstCellIndex;
      }
      return firstCellIndex + (sizeItem.height - 1) * cols;
    case "br":
      return cellMap.lastIndexOf(index);
    default:
      return -1;
  }
}
function getGridCellIndices(indices, cellMap) {
  return cellMap.flatMap((index, cellIndex) => indices.includes(index) ? [cellIndex] : []);
}
function isListIndexDisabled(listRef, index, disabledIndices) {
  if (typeof disabledIndices === "function") {
    return disabledIndices(index);
  }
  if (disabledIndices) {
    return disabledIndices.includes(index);
  }
  const element = listRef.current[index];
  if (!element) {
    return false;
  }
  return element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true";
}
const getTabbableOptions = () => ({
  getShadowRoot: true,
  displayCheck: (
    // JSDOM does not support the `tabbable` library. To solve this we can
    // check if `ResizeObserver` is a real function (not polyfilled), which
    // determines if the current environment is JSDOM-like.
    typeof ResizeObserver === "function" && ResizeObserver.toString().includes("[native code]") ? "full" : "none"
  )
});
function getTabbableIn(container, dir) {
  const list = tabbable(container, getTabbableOptions());
  const len = list.length;
  if (len === 0) {
    return void 0;
  }
  const active = activeElement(getDocument(container));
  const index = list.indexOf(active);
  const nextIndex = index === -1 ? dir === 1 ? 0 : len - 1 : index + dir;
  return list[nextIndex];
}
function getNextTabbable(referenceElement) {
  return getTabbableIn(getDocument(referenceElement).body, 1) || referenceElement;
}
function getPreviousTabbable(referenceElement) {
  return getTabbableIn(getDocument(referenceElement).body, -1) || referenceElement;
}
function getTabbableNearElement(referenceElement, dir) {
  if (!referenceElement) {
    return null;
  }
  const list = tabbable(getDocument(referenceElement).body, getTabbableOptions());
  const elementCount = list.length;
  if (elementCount === 0) {
    return null;
  }
  const index = list.indexOf(referenceElement);
  if (index === -1) {
    return null;
  }
  const nextIndex = (index + dir + elementCount) % elementCount;
  return list[nextIndex];
}
function getTabbableAfterElement(referenceElement) {
  return getTabbableNearElement(referenceElement, 1);
}
function getTabbableBeforeElement(referenceElement) {
  return getTabbableNearElement(referenceElement, -1);
}
function isOutsideEvent(event, container) {
  const containerElement = container || event.currentTarget;
  const relatedTarget = event.relatedTarget;
  return !relatedTarget || !contains(containerElement, relatedTarget);
}
function disableFocusInside(container) {
  const tabbableElements = tabbable(container, getTabbableOptions());
  tabbableElements.forEach((element) => {
    element.dataset.tabindex = element.getAttribute("tabindex") || "";
    element.setAttribute("tabindex", "-1");
  });
}
function enableFocusInside(container) {
  const elements = container.querySelectorAll("[data-tabindex]");
  elements.forEach((element) => {
    const tabindex = element.dataset.tabindex;
    delete element.dataset.tabindex;
    if (tabindex) {
      element.setAttribute("tabindex", tabindex);
    } else {
      element.removeAttribute("tabindex");
    }
  });
}
const ToastContext = /* @__PURE__ */ reactExports.createContext(void 0);
function useToastContext() {
  const context = reactExports.useContext(ToastContext);
  if (!context) {
    throw new Error(formatErrorMessage(73));
  }
  return context;
}
function resolvePromiseOptions(options, result) {
  if (typeof options === "string") {
    return {
      description: options
    };
  }
  if (typeof options === "function") {
    const resolvedOptions = options(result);
    return typeof resolvedOptions === "string" ? {
      description: resolvedOptions
    } : resolvedOptions;
  }
  return options;
}
const ToastProvider = function ToastProvider2(props) {
  const {
    children,
    timeout = 5e3,
    limit = 3,
    toastManager
  } = props;
  const [toasts, setToasts] = reactExports.useState([]);
  const [hovering, setHovering] = reactExports.useState(false);
  const [focused, setFocused] = reactExports.useState(false);
  const [prevFocusElement, setPrevFocusElement] = reactExports.useState(null);
  if (toasts.length === 0) {
    if (hovering) {
      setHovering(false);
    }
    if (focused) {
      setFocused(false);
    }
  }
  const expanded = hovering || focused;
  const timersRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const viewportRef = reactExports.useRef(null);
  const windowFocusedRef = reactExports.useRef(true);
  const isPausedRef = reactExports.useRef(false);
  function handleFocusManagement(toastId) {
    const activeEl = activeElement(ownerDocument(viewportRef.current));
    if (!viewportRef.current || !contains(viewportRef.current, activeEl) || !matchesFocusVisible(activeEl)) {
      return;
    }
    const currentIndex = toasts.findIndex((toast) => toast.id === toastId);
    let nextToast = null;
    let index = currentIndex + 1;
    while (index < toasts.length) {
      if (toasts[index].transitionStatus !== "ending") {
        nextToast = toasts[index];
        break;
      }
      index += 1;
    }
    if (!nextToast) {
      index = currentIndex - 1;
      while (index >= 0) {
        if (toasts[index].transitionStatus !== "ending") {
          nextToast = toasts[index];
          break;
        }
        index -= 1;
      }
    }
    if (nextToast) {
      nextToast.ref?.current?.focus();
    } else {
      prevFocusElement?.focus({
        preventScroll: true
      });
    }
  }
  const pauseTimers = useStableCallback(() => {
    if (isPausedRef.current) {
      return;
    }
    isPausedRef.current = true;
    timersRef.current.forEach((timer) => {
      if (timer.timeout) {
        timer.timeout.clear();
        const elapsed = Date.now() - timer.start;
        const remaining = timer.delay - elapsed;
        timer.remaining = remaining > 0 ? remaining : 0;
      }
    });
  });
  const resumeTimers = useStableCallback(() => {
    if (!isPausedRef.current) {
      return;
    }
    isPausedRef.current = false;
    timersRef.current.forEach((timer, id) => {
      timer.remaining = timer.remaining > 0 ? timer.remaining : timer.delay;
      timer.timeout ??= Timeout.create();
      timer.timeout.start(timer.remaining, () => {
        timersRef.current.delete(id);
        timer.callback();
      });
      timer.start = Date.now();
    });
  });
  const close = useStableCallback((toastId) => {
    setToasts((prevToasts) => {
      const toastsWithEnding = prevToasts.map((toast2) => toast2.id === toastId ? {
        ...toast2,
        transitionStatus: "ending",
        height: 0
      } : toast2);
      const activeToasts = toastsWithEnding.filter((t) => t.transitionStatus !== "ending");
      return toastsWithEnding.map((toast2) => {
        if (toast2.transitionStatus === "ending") {
          return toast2;
        }
        const isActiveToastLimited = activeToasts.indexOf(toast2) >= limit;
        return {
          ...toast2,
          limited: isActiveToastLimited
        };
      });
    });
    const timer = timersRef.current.get(toastId);
    if (timer && timer.timeout) {
      timer.timeout.clear();
      timersRef.current.delete(toastId);
    }
    const toast = toasts.find((t) => t.id === toastId);
    toast?.onClose?.();
    handleFocusManagement(toastId);
    if (toasts.length === 1) {
      setHovering(false);
      setFocused(false);
    }
  });
  const remove = useStableCallback((toastId) => {
    setToasts((prev) => prev.filter((toast2) => toast2.id !== toastId));
    const toast = toasts.find((t) => t.id === toastId);
    toast?.onRemove?.();
  });
  const scheduleTimer = useStableCallback((id, delay, callback) => {
    const start = Date.now();
    const shouldStartActive = windowFocusedRef.current && !hovering && !focused;
    const currentTimeout = shouldStartActive ? Timeout.create() : void 0;
    currentTimeout?.start(delay, () => {
      timersRef.current.delete(id);
      callback();
    });
    timersRef.current.set(id, {
      timeout: currentTimeout,
      start: shouldStartActive ? start : 0,
      delay,
      remaining: delay,
      callback
    });
  });
  const add = useStableCallback((toast) => {
    const id = toast.id || generateId("toast");
    const toastToAdd = {
      ...toast,
      id,
      transitionStatus: "starting"
    };
    setToasts((prev) => {
      const updatedToasts = [toastToAdd, ...prev];
      const activeToasts = updatedToasts.filter((t) => t.transitionStatus !== "ending");
      if (activeToasts.length > limit) {
        const excessCount = activeToasts.length - limit;
        const oldestActiveToasts = activeToasts.slice(-excessCount);
        return updatedToasts.map((t) => oldestActiveToasts.some((old) => old.id === t.id) ? {
          ...t,
          limited: true
        } : {
          ...t,
          limited: false
        });
      }
      return updatedToasts.map((t) => ({
        ...t,
        limited: false
      }));
    });
    const duration = toastToAdd.timeout ?? timeout;
    if (toastToAdd.type !== "loading" && duration > 0) {
      scheduleTimer(id, duration, () => close(id));
    }
    if (hovering || focused || !windowFocusedRef.current) {
      pauseTimers();
    }
    return id;
  });
  const update = useStableCallback((id, updates) => {
    const prevToast = toasts.find((toast) => toast.id === id) ?? null;
    const nextToast = prevToast ? {
      ...prevToast,
      ...updates
    } : null;
    reactDomExports.flushSync(() => {
      setToasts((prev) => prev.map((toast) => toast.id === id ? {
        ...toast,
        ...updates
      } : toast));
    });
    if (!nextToast) {
      return;
    }
    const nextTimeout = nextToast.timeout ?? timeout;
    const prevTimeout = prevToast?.timeout ?? timeout;
    const timeoutUpdated = Object.hasOwn(updates, "timeout");
    const shouldHaveTimer = nextToast.transitionStatus !== "ending" && nextToast.type !== "loading" && nextTimeout > 0;
    const hasTimer = timersRef.current.has(id);
    const timeoutChanged = prevTimeout !== nextTimeout;
    const wasLoading = prevToast?.type === "loading";
    if (!shouldHaveTimer && hasTimer) {
      const timer = timersRef.current.get(id);
      timer?.timeout?.clear();
      timersRef.current.delete(id);
      return;
    }
    if (shouldHaveTimer && (!hasTimer || timeoutChanged || timeoutUpdated || wasLoading)) {
      const timer = timersRef.current.get(id);
      if (timer) {
        timer.timeout?.clear();
        timersRef.current.delete(id);
      }
      scheduleTimer(id, nextTimeout, () => close(id));
      if (hovering || focused || !windowFocusedRef.current) {
        pauseTimers();
      }
    }
  });
  const promise = useStableCallback((promiseValue, options) => {
    const loadingOptions = resolvePromiseOptions(options.loading);
    const id = add({
      ...loadingOptions,
      type: "loading"
    });
    const handledPromise = promiseValue.then((result) => {
      const successOptions = resolvePromiseOptions(options.success, result);
      update(id, {
        ...successOptions,
        type: "success",
        timeout: successOptions.timeout
      });
      return result;
    }).catch((error) => {
      const errorOptions = resolvePromiseOptions(options.error, error);
      update(id, {
        ...errorOptions,
        type: "error",
        timeout: errorOptions.timeout
      });
      return Promise.reject(error);
    });
    if ({}.hasOwnProperty.call(options, "setPromise")) {
      options.setPromise(handledPromise);
    }
    return handledPromise;
  });
  reactExports.useEffect(function subscribeToToastManager() {
    if (!toastManager) {
      return void 0;
    }
    const unsubscribe = toastManager[" subscribe"](({
      action,
      options
    }) => {
      const id = options.id;
      if (action === "promise" && options.promise) {
        promise(options.promise, options);
      } else if (action === "update" && id) {
        update(id, options);
      } else if (action === "close" && id) {
        close(id);
      } else {
        add(options);
      }
    });
    return unsubscribe;
  }, [add, update, scheduleTimer, timeout, toastManager, promise, close]);
  const contextValue = reactExports.useMemo(() => ({
    toasts,
    setToasts,
    hovering,
    setHovering,
    focused,
    setFocused,
    expanded,
    add,
    close,
    remove,
    update,
    promise,
    pauseTimers,
    resumeTimers,
    prevFocusElement,
    setPrevFocusElement,
    viewportRef,
    scheduleTimer,
    windowFocusedRef
  }), [add, close, focused, hovering, expanded, pauseTimers, prevFocusElement, promise, remove, resumeTimers, scheduleTimer, toasts, update]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ToastContext.Provider, {
    value: contextValue,
    children
  });
};
const FocusGuard = /* @__PURE__ */ reactExports.forwardRef(function FocusGuard2(props, ref) {
  const [role, setRole] = reactExports.useState();
  useIsoLayoutEffect(() => {
    if (isSafari) {
      setRole("button");
    }
  }, []);
  const restProps = {
    tabIndex: 0,
    // Role is only for VoiceOver
    role
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
    ...props,
    ref,
    style: visuallyHidden,
    "aria-hidden": role ? void 0 : true,
    ...restProps,
    "data-base-ui-focus-guard": ""
  });
});
const ToastViewportContext = /* @__PURE__ */ reactExports.createContext(void 0);
let ToastViewportCssVars = /* @__PURE__ */ (function(ToastViewportCssVars2) {
  ToastViewportCssVars2["frontmostHeight"] = "--toast-frontmost-height";
  return ToastViewportCssVars2;
})({});
const ToastViewport = /* @__PURE__ */ reactExports.forwardRef(function ToastViewport2(componentProps, forwardedRef) {
  const {
    render,
    className,
    children,
    ...elementProps
  } = componentProps;
  const {
    toasts,
    pauseTimers,
    resumeTimers,
    setHovering,
    setFocused,
    viewportRef,
    windowFocusedRef,
    prevFocusElement,
    setPrevFocusElement,
    expanded,
    focused
  } = useToastContext();
  const handlingFocusGuardRef = reactExports.useRef(false);
  const markedReadyForMouseLeaveRef = reactExports.useRef(false);
  const numToasts = toasts.length;
  const frontmostHeight = toasts[0]?.height ?? 0;
  const hasTransitioningToasts = reactExports.useMemo(() => toasts.some((toast) => toast.transitionStatus === "ending"), [toasts]);
  reactExports.useEffect(() => {
    if (!viewportRef.current) {
      return void 0;
    }
    function handleGlobalKeyDown(event) {
      if (numToasts === 0) {
        return;
      }
      if (event.key === "F6" && event.target !== viewportRef.current) {
        event.preventDefault();
        setPrevFocusElement(activeElement(ownerDocument(viewportRef.current)));
        viewportRef.current?.focus({
          preventScroll: true
        });
        pauseTimers();
        setFocused(true);
      }
    }
    const win = getWindow(viewportRef.current);
    win.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      win.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [pauseTimers, setFocused, setPrevFocusElement, numToasts, viewportRef]);
  reactExports.useEffect(() => {
    if (!viewportRef.current || !numToasts) {
      return void 0;
    }
    const win = getWindow(viewportRef.current);
    function handleWindowBlur(event) {
      if (event.target !== win) {
        return;
      }
      windowFocusedRef.current = false;
      pauseTimers();
    }
    function handleWindowFocus(event) {
      if (event.relatedTarget || event.target === win) {
        return;
      }
      const target = getTarget(event);
      const activeEl = activeElement(ownerDocument(viewportRef.current));
      if (!contains(viewportRef.current, target) || !matchesFocusVisible(activeEl)) {
        resumeTimers();
      }
      setTimeout(() => {
        windowFocusedRef.current = true;
      });
    }
    win.addEventListener("blur", handleWindowBlur, true);
    win.addEventListener("focus", handleWindowFocus, true);
    return () => {
      win.removeEventListener("blur", handleWindowBlur, true);
      win.removeEventListener("focus", handleWindowFocus, true);
    };
  }, [
    pauseTimers,
    resumeTimers,
    viewportRef,
    windowFocusedRef,
    setFocused,
    // `viewportRef.current` isn't available on the first render,
    // since the portal node hasn't yet been created.
    // By adding this dependency, we ensure the window listeners
    // are added when toasts have been created, once the ref is available.
    numToasts
  ]);
  reactExports.useEffect(() => {
    const viewportNode = viewportRef.current;
    if (!viewportNode || numToasts === 0) {
      return void 0;
    }
    const doc = ownerDocument(viewportNode);
    function handlePointerDown(event) {
      if (event.pointerType !== "touch") {
        return;
      }
      const target = getTarget(event);
      if (contains(viewportNode, target)) {
        return;
      }
      resumeTimers();
      setHovering(false);
      setFocused(false);
    }
    doc.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      doc.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [numToasts, resumeTimers, setFocused, setHovering, viewportRef]);
  function handleFocusGuard(event) {
    if (!viewportRef.current) {
      return;
    }
    handlingFocusGuardRef.current = true;
    if (event.relatedTarget === viewportRef.current) {
      toasts[0]?.ref?.current?.focus();
    } else {
      prevFocusElement?.focus({
        preventScroll: true
      });
    }
  }
  function handleKeyDown(event) {
    if (event.key === "Tab" && event.shiftKey && event.target === viewportRef.current) {
      event.preventDefault();
      prevFocusElement?.focus({
        preventScroll: true
      });
      resumeTimers();
    }
  }
  reactExports.useEffect(() => {
    if (!windowFocusedRef.current || hasTransitioningToasts || !markedReadyForMouseLeaveRef.current) {
      return;
    }
    resumeTimers();
    setHovering(false);
    markedReadyForMouseLeaveRef.current = false;
  }, [hasTransitioningToasts, resumeTimers, setHovering, windowFocusedRef]);
  function handleMouseEnter() {
    pauseTimers();
    setHovering(true);
    markedReadyForMouseLeaveRef.current = false;
  }
  function handleMouseLeave() {
    if (toasts.some((toast) => toast.transitionStatus === "ending")) {
      markedReadyForMouseLeaveRef.current = true;
    } else {
      resumeTimers();
      setHovering(false);
    }
  }
  function handleFocus() {
    if (handlingFocusGuardRef.current) {
      handlingFocusGuardRef.current = false;
      return;
    }
    if (focused) {
      return;
    }
    if (matchesFocusVisible(ownerDocument(viewportRef.current).activeElement)) {
      setFocused(true);
      pauseTimers();
    }
  }
  function handleBlur(event) {
    if (!focused || contains(viewportRef.current, event.relatedTarget)) {
      return;
    }
    setFocused(false);
    resumeTimers();
  }
  const defaultProps = {
    tabIndex: -1,
    role: "region",
    "aria-live": "polite",
    "aria-atomic": false,
    "aria-relevant": "additions text",
    "aria-label": "Notifications",
    onMouseEnter: handleMouseEnter,
    onMouseMove: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    onClick: handleFocus
  };
  const state = reactExports.useMemo(() => ({
    expanded
  }), [expanded]);
  const element = useRenderElement("div", componentProps, {
    ref: [forwardedRef, viewportRef],
    state,
    props: [defaultProps, {
      style: {
        [ToastViewportCssVars.frontmostHeight]: frontmostHeight ? `${frontmostHeight}px` : void 0
      }
    }, elementProps, {
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, {
        children: [numToasts > 0 && prevFocusElement && /* @__PURE__ */ jsxRuntimeExports.jsx(FocusGuard, {
          onFocus: handleFocusGuard
        }), children, numToasts > 0 && prevFocusElement && /* @__PURE__ */ jsxRuntimeExports.jsx(FocusGuard, {
          onFocus: handleFocusGuard
        })]
      })
    }]
  });
  const contextValue = reactExports.useMemo(() => ({
    viewportRef
  }), [viewportRef]);
  const highPriorityToasts = reactExports.useMemo(() => toasts.filter((toast) => toast.priority === "high"), [toasts]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ToastViewportContext.Provider, {
    value: contextValue,
    children: [numToasts > 0 && prevFocusElement && /* @__PURE__ */ jsxRuntimeExports.jsx(FocusGuard, {
      onFocus: handleFocusGuard
    }), element, !focused && highPriorityToasts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      style: visuallyHidden,
      children: highPriorityToasts.map((toast) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        role: "alert",
        "aria-atomic": true,
        children: [/* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          children: toast.title
        }), /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          children: toast.description
        })]
      }, toast.id))
    })]
  });
});
const ToastRootContext = /* @__PURE__ */ reactExports.createContext(void 0);
function useToastRootContext() {
  const context = reactExports.useContext(ToastRootContext);
  if (!context) {
    throw new Error(formatErrorMessage(66));
  }
  return context;
}
let TransitionStatusDataAttributes = /* @__PURE__ */ (function(TransitionStatusDataAttributes2) {
  TransitionStatusDataAttributes2["startingStyle"] = "data-starting-style";
  TransitionStatusDataAttributes2["endingStyle"] = "data-ending-style";
  return TransitionStatusDataAttributes2;
})({});
const STARTING_HOOK = {
  [TransitionStatusDataAttributes.startingStyle]: ""
};
const ENDING_HOOK = {
  [TransitionStatusDataAttributes.endingStyle]: ""
};
const transitionStatusMapping = {
  transitionStatus(value) {
    if (value === "starting") {
      return STARTING_HOOK;
    }
    if (value === "ending") {
      return ENDING_HOOK;
    }
    return null;
  }
};
function resolveRef(maybeRef) {
  if (maybeRef == null) {
    return maybeRef;
  }
  return "current" in maybeRef ? maybeRef.current : maybeRef;
}
function useAnimationsFinished(elementOrRef, waitForStartingStyleRemoved = false, treatAbortedAsFinished = true) {
  const frame = useAnimationFrame();
  return useStableCallback((fnToExecute, signal = null) => {
    frame.cancel();
    function done() {
      reactDomExports.flushSync(fnToExecute);
    }
    const element = resolveRef(elementOrRef);
    if (element == null) {
      return;
    }
    const resolvedElement = element;
    if (typeof resolvedElement.getAnimations !== "function" || globalThis.BASE_UI_ANIMATIONS_DISABLED) {
      fnToExecute();
    } else {
      let execWaitForStartingStyleRemoved = function() {
        const startingStyleAttribute = TransitionStatusDataAttributes.startingStyle;
        if (!resolvedElement.hasAttribute(startingStyleAttribute)) {
          frame.request(exec);
          return;
        }
        const attributeObserver = new MutationObserver(() => {
          if (!resolvedElement.hasAttribute(startingStyleAttribute)) {
            attributeObserver.disconnect();
            exec();
          }
        });
        attributeObserver.observe(resolvedElement, {
          attributes: true,
          attributeFilter: [startingStyleAttribute]
        });
        signal?.addEventListener("abort", () => attributeObserver.disconnect(), {
          once: true
        });
      }, exec = function() {
        Promise.all(resolvedElement.getAnimations().map((anim) => anim.finished)).then(() => {
          if (signal?.aborted) {
            return;
          }
          done();
        }).catch(() => {
          const currentAnimations = resolvedElement.getAnimations();
          if (treatAbortedAsFinished) {
            if (signal?.aborted) {
              return;
            }
            done();
          } else if (currentAnimations.length > 0 && currentAnimations.some((anim) => anim.pending || anim.playState !== "finished")) {
            exec();
          }
        });
      };
      if (waitForStartingStyleRemoved) {
        execWaitForStartingStyleRemoved();
        return;
      }
      frame.request(exec);
    }
  });
}
function useOpenChangeComplete(parameters) {
  const {
    enabled = true,
    open,
    ref,
    onComplete: onCompleteParam
  } = parameters;
  const onComplete = useStableCallback(onCompleteParam);
  const runOnceAnimationsFinish = useAnimationsFinished(ref, open, false);
  reactExports.useEffect(() => {
    if (!enabled) {
      return void 0;
    }
    const abortController = new AbortController();
    runOnceAnimationsFinish(onComplete, abortController.signal);
    return () => {
      abortController.abort();
    };
  }, [enabled, open, onComplete, runOnceAnimationsFinish]);
}
let ToastRootCssVars = /* @__PURE__ */ (function(ToastRootCssVars2) {
  ToastRootCssVars2["index"] = "--toast-index";
  ToastRootCssVars2["offsetY"] = "--toast-offset-y";
  ToastRootCssVars2["height"] = "--toast-height";
  ToastRootCssVars2["swipeMovementX"] = "--toast-swipe-movement-x";
  ToastRootCssVars2["swipeMovementY"] = "--toast-swipe-movement-y";
  return ToastRootCssVars2;
})({});
const stateAttributesMapping$6 = {
  ...transitionStatusMapping,
  swipeDirection(value) {
    return value ? {
      "data-swipe-direction": value
    } : null;
  }
};
const SWIPE_THRESHOLD = 40;
const REVERSE_CANCEL_THRESHOLD = 10;
const OPPOSITE_DIRECTION_DAMPING_FACTOR = 0.5;
const MIN_DRAG_THRESHOLD = 1;
function getDisplacement(direction, deltaX, deltaY) {
  switch (direction) {
    case "up":
      return -deltaY;
    case "down":
      return deltaY;
    case "left":
      return -deltaX;
    case "right":
      return deltaX;
    default:
      return 0;
  }
}
function getElementTransform(element) {
  const computedStyle = window.getComputedStyle(element);
  const transform = computedStyle.transform;
  let translateX = 0;
  let translateY = 0;
  let scale = 1;
  if (transform && transform !== "none") {
    const matrix = transform.match(/matrix(?:3d)?\(([^)]+)\)/);
    if (matrix) {
      const values = matrix[1].split(", ").map(parseFloat);
      if (values.length === 6) {
        translateX = values[4];
        translateY = values[5];
        scale = Math.sqrt(values[0] * values[0] + values[1] * values[1]);
      } else if (values.length === 16) {
        translateX = values[12];
        translateY = values[13];
        scale = values[0];
      }
    }
  }
  return {
    x: translateX,
    y: translateY,
    scale
  };
}
const ToastRoot = /* @__PURE__ */ reactExports.forwardRef(function ToastRoot2(componentProps, forwardedRef) {
  const {
    toast,
    render,
    className,
    swipeDirection = ["down", "right"],
    ...elementProps
  } = componentProps;
  const isAnchored = toast.positionerProps?.anchor !== void 0;
  let swipeDirections = [];
  if (!isAnchored) {
    swipeDirections = Array.isArray(swipeDirection) ? swipeDirection : [swipeDirection];
  }
  const swipeEnabled = swipeDirections.length > 0;
  const {
    toasts,
    focused,
    close,
    remove,
    setToasts,
    pauseTimers,
    expanded,
    setHovering
  } = useToastContext();
  const [currentSwipeDirection, setCurrentSwipeDirection] = reactExports.useState(void 0);
  const [isSwiping, setIsSwiping] = reactExports.useState(false);
  const [isRealSwipe, setIsRealSwipe] = reactExports.useState(false);
  const [dragDismissed, setDragDismissed] = reactExports.useState(false);
  const [dragOffset, setDragOffset] = reactExports.useState({
    x: 0,
    y: 0
  });
  const [initialTransform, setInitialTransform] = reactExports.useState({
    x: 0,
    y: 0,
    scale: 1
  });
  const [titleId, setTitleId] = reactExports.useState();
  const [descriptionId, setDescriptionId] = reactExports.useState();
  const [lockedDirection, setLockedDirection] = reactExports.useState(null);
  const rootRef = reactExports.useRef(null);
  const dragStartPosRef = reactExports.useRef({
    x: 0,
    y: 0
  });
  const initialTransformRef = reactExports.useRef({
    x: 0,
    y: 0,
    scale: 1
  });
  const intendedSwipeDirectionRef = reactExports.useRef(void 0);
  const maxSwipeDisplacementRef = reactExports.useRef(0);
  const cancelledSwipeRef = reactExports.useRef(false);
  const swipeCancelBaselineRef = reactExports.useRef({
    x: 0,
    y: 0
  });
  const isFirstPointerMoveRef = reactExports.useRef(false);
  const domIndex = reactExports.useMemo(() => toasts.indexOf(toast), [toast, toasts]);
  const visibleIndex = reactExports.useMemo(() => toasts.filter((t) => t.transitionStatus !== "ending").indexOf(toast), [toast, toasts]);
  const offsetY = reactExports.useMemo(() => {
    return toasts.slice(0, toasts.indexOf(toast)).reduce((acc, t) => acc + (t.height || 0), 0);
  }, [toasts, toast]);
  useOpenChangeComplete({
    open: toast.transitionStatus !== "ending",
    ref: rootRef,
    onComplete() {
      if (toast.transitionStatus === "ending") {
        remove(toast.id);
      }
    }
  });
  const recalculateHeight = useStableCallback((flushSync = false) => {
    const element2 = rootRef.current;
    if (!element2) {
      return;
    }
    const previousHeight = element2.style.height;
    element2.style.height = "auto";
    const height = element2.offsetHeight;
    element2.style.height = previousHeight;
    function update() {
      setToasts((prev) => prev.map((t) => t.id === toast.id ? {
        ...t,
        ref: rootRef,
        height,
        transitionStatus: void 0
      } : t));
    }
    if (flushSync) {
      reactDomExports.flushSync(update);
    } else {
      update();
    }
  });
  useIsoLayoutEffect(recalculateHeight, [recalculateHeight]);
  function applyDirectionalDamping(deltaX, deltaY) {
    let newDeltaX = deltaX;
    let newDeltaY = deltaY;
    if (!swipeDirections.includes("left") && !swipeDirections.includes("right")) {
      newDeltaX = deltaX > 0 ? deltaX ** OPPOSITE_DIRECTION_DAMPING_FACTOR : -(Math.abs(deltaX) ** OPPOSITE_DIRECTION_DAMPING_FACTOR);
    } else {
      if (!swipeDirections.includes("right") && deltaX > 0) {
        newDeltaX = deltaX ** OPPOSITE_DIRECTION_DAMPING_FACTOR;
      }
      if (!swipeDirections.includes("left") && deltaX < 0) {
        newDeltaX = -(Math.abs(deltaX) ** OPPOSITE_DIRECTION_DAMPING_FACTOR);
      }
    }
    if (!swipeDirections.includes("up") && !swipeDirections.includes("down")) {
      newDeltaY = deltaY > 0 ? deltaY ** OPPOSITE_DIRECTION_DAMPING_FACTOR : -(Math.abs(deltaY) ** OPPOSITE_DIRECTION_DAMPING_FACTOR);
    } else {
      if (!swipeDirections.includes("down") && deltaY > 0) {
        newDeltaY = deltaY ** OPPOSITE_DIRECTION_DAMPING_FACTOR;
      }
      if (!swipeDirections.includes("up") && deltaY < 0) {
        newDeltaY = -(Math.abs(deltaY) ** OPPOSITE_DIRECTION_DAMPING_FACTOR);
      }
    }
    return {
      x: newDeltaX,
      y: newDeltaY
    };
  }
  function handlePointerDown(event) {
    if (event.button !== 0) {
      return;
    }
    if (event.pointerType === "touch") {
      pauseTimers();
    }
    const target = getTarget(event.nativeEvent);
    const isInteractiveElement2 = target ? target.closest('button,a,input,textarea,[role="button"],[data-swipe-ignore]') : false;
    if (isInteractiveElement2) {
      return;
    }
    cancelledSwipeRef.current = false;
    intendedSwipeDirectionRef.current = void 0;
    maxSwipeDisplacementRef.current = 0;
    dragStartPosRef.current = {
      x: event.clientX,
      y: event.clientY
    };
    swipeCancelBaselineRef.current = dragStartPosRef.current;
    if (rootRef.current) {
      const transform = getElementTransform(rootRef.current);
      initialTransformRef.current = transform;
      setInitialTransform(transform);
      setDragOffset({
        x: transform.x,
        y: transform.y
      });
    }
    setHovering(true);
    setIsSwiping(true);
    setIsRealSwipe(false);
    setLockedDirection(null);
    isFirstPointerMoveRef.current = true;
    rootRef.current?.setPointerCapture(event.pointerId);
  }
  function handlePointerMove(event) {
    if (!isSwiping) {
      return;
    }
    event.preventDefault();
    if (isFirstPointerMoveRef.current) {
      dragStartPosRef.current = {
        x: event.clientX,
        y: event.clientY
      };
      isFirstPointerMoveRef.current = false;
    }
    const {
      clientY,
      clientX,
      movementX,
      movementY
    } = event;
    if (movementY < 0 && clientY > swipeCancelBaselineRef.current.y || movementY > 0 && clientY < swipeCancelBaselineRef.current.y) {
      swipeCancelBaselineRef.current = {
        x: swipeCancelBaselineRef.current.x,
        y: clientY
      };
    }
    if (movementX < 0 && clientX > swipeCancelBaselineRef.current.x || movementX > 0 && clientX < swipeCancelBaselineRef.current.x) {
      swipeCancelBaselineRef.current = {
        x: clientX,
        y: swipeCancelBaselineRef.current.y
      };
    }
    const deltaX = clientX - dragStartPosRef.current.x;
    const deltaY = clientY - dragStartPosRef.current.y;
    const cancelDeltaY = clientY - swipeCancelBaselineRef.current.y;
    const cancelDeltaX = clientX - swipeCancelBaselineRef.current.x;
    if (!isRealSwipe) {
      const movementDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (movementDistance >= MIN_DRAG_THRESHOLD) {
        setIsRealSwipe(true);
        if (lockedDirection === null) {
          const hasHorizontal = swipeDirections.includes("left") || swipeDirections.includes("right");
          const hasVertical = swipeDirections.includes("up") || swipeDirections.includes("down");
          if (hasHorizontal && hasVertical) {
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);
            setLockedDirection(absX > absY ? "horizontal" : "vertical");
          }
        }
      }
    }
    let candidate;
    if (!intendedSwipeDirectionRef.current) {
      if (lockedDirection === "vertical") {
        if (deltaY > 0) {
          candidate = "down";
        } else if (deltaY < 0) {
          candidate = "up";
        }
      } else if (lockedDirection === "horizontal") {
        if (deltaX > 0) {
          candidate = "right";
        } else if (deltaX < 0) {
          candidate = "left";
        }
      } else if (Math.abs(deltaX) >= Math.abs(deltaY)) {
        candidate = deltaX > 0 ? "right" : "left";
      } else {
        candidate = deltaY > 0 ? "down" : "up";
      }
      if (candidate && swipeDirections.includes(candidate)) {
        intendedSwipeDirectionRef.current = candidate;
        maxSwipeDisplacementRef.current = getDisplacement(candidate, deltaX, deltaY);
        setCurrentSwipeDirection(candidate);
      }
    } else {
      const direction = intendedSwipeDirectionRef.current;
      const currentDisplacement = getDisplacement(direction, cancelDeltaX, cancelDeltaY);
      if (currentDisplacement > SWIPE_THRESHOLD) {
        cancelledSwipeRef.current = false;
        setCurrentSwipeDirection(direction);
      } else if (!(swipeDirections.includes("left") && swipeDirections.includes("right")) && !(swipeDirections.includes("up") && swipeDirections.includes("down")) && maxSwipeDisplacementRef.current - currentDisplacement >= REVERSE_CANCEL_THRESHOLD) {
        cancelledSwipeRef.current = true;
      }
    }
    const dampedDelta = applyDirectionalDamping(deltaX, deltaY);
    let newOffsetX = initialTransformRef.current.x;
    let newOffsetY = initialTransformRef.current.y;
    if (lockedDirection === "horizontal") {
      if (swipeDirections.includes("left") || swipeDirections.includes("right")) {
        newOffsetX += dampedDelta.x;
      }
    } else if (lockedDirection === "vertical") {
      if (swipeDirections.includes("up") || swipeDirections.includes("down")) {
        newOffsetY += dampedDelta.y;
      }
    } else {
      if (swipeDirections.includes("left") || swipeDirections.includes("right")) {
        newOffsetX += dampedDelta.x;
      }
      if (swipeDirections.includes("up") || swipeDirections.includes("down")) {
        newOffsetY += dampedDelta.y;
      }
    }
    setDragOffset({
      x: newOffsetX,
      y: newOffsetY
    });
  }
  function handlePointerUp(event) {
    if (!isSwiping) {
      return;
    }
    setIsSwiping(false);
    setIsRealSwipe(false);
    setLockedDirection(null);
    rootRef.current?.releasePointerCapture(event.pointerId);
    if (cancelledSwipeRef.current) {
      setDragOffset({
        x: initialTransform.x,
        y: initialTransform.y
      });
      setCurrentSwipeDirection(void 0);
      return;
    }
    let shouldClose = false;
    const deltaX = dragOffset.x - initialTransform.x;
    const deltaY = dragOffset.y - initialTransform.y;
    let dismissDirection;
    for (const direction of swipeDirections) {
      switch (direction) {
        case "right":
          if (deltaX > SWIPE_THRESHOLD) {
            shouldClose = true;
            dismissDirection = "right";
          }
          break;
        case "left":
          if (deltaX < -SWIPE_THRESHOLD) {
            shouldClose = true;
            dismissDirection = "left";
          }
          break;
        case "down":
          if (deltaY > SWIPE_THRESHOLD) {
            shouldClose = true;
            dismissDirection = "down";
          }
          break;
        case "up":
          if (deltaY < -SWIPE_THRESHOLD) {
            shouldClose = true;
            dismissDirection = "up";
          }
          break;
      }
      if (shouldClose) {
        break;
      }
    }
    if (shouldClose) {
      setCurrentSwipeDirection(dismissDirection);
      setDragDismissed(true);
      close(toast.id);
    } else {
      setDragOffset({
        x: initialTransform.x,
        y: initialTransform.y
      });
      setCurrentSwipeDirection(void 0);
    }
  }
  function handleKeyDown(event) {
    if (event.key === "Escape") {
      if (!rootRef.current || !contains(rootRef.current, activeElement(ownerDocument(rootRef.current)))) {
        return;
      }
      close(toast.id);
    }
  }
  reactExports.useEffect(() => {
    if (!swipeEnabled) {
      return void 0;
    }
    const element2 = rootRef.current;
    if (!element2) {
      return void 0;
    }
    function preventDefaultTouchStart(event) {
      if (contains(element2, event.target)) {
        event.preventDefault();
      }
    }
    element2.addEventListener("touchmove", preventDefaultTouchStart, {
      passive: false
    });
    return () => {
      element2.removeEventListener("touchmove", preventDefaultTouchStart);
    };
  }, [swipeEnabled]);
  function getDragStyles() {
    if (!isSwiping && dragOffset.x === initialTransform.x && dragOffset.y === initialTransform.y && !dragDismissed) {
      return {
        [ToastRootCssVars.swipeMovementX]: "0px",
        [ToastRootCssVars.swipeMovementY]: "0px"
      };
    }
    const deltaX = dragOffset.x - initialTransform.x;
    const deltaY = dragOffset.y - initialTransform.y;
    return {
      transition: isSwiping ? "none" : void 0,
      // While swiping, freeze the element at its current visual transform so it doesn't snap to the
      // end position.
      transform: isSwiping ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) scale(${initialTransform.scale})` : void 0,
      [ToastRootCssVars.swipeMovementX]: `${deltaX}px`,
      [ToastRootCssVars.swipeMovementY]: `${deltaY}px`
    };
  }
  const isHighPriority = toast.priority === "high";
  const defaultProps = {
    role: isHighPriority ? "alertdialog" : "dialog",
    tabIndex: 0,
    "aria-modal": false,
    "aria-labelledby": titleId,
    "aria-describedby": descriptionId,
    "aria-hidden": isHighPriority && !focused ? true : void 0,
    onPointerDown: swipeEnabled ? handlePointerDown : void 0,
    onPointerMove: swipeEnabled ? handlePointerMove : void 0,
    onPointerUp: swipeEnabled ? handlePointerUp : void 0,
    onKeyDown: handleKeyDown,
    inert: inertValue(toast.limited),
    style: {
      ...getDragStyles(),
      [ToastRootCssVars.index]: toast.transitionStatus === "ending" ? domIndex : visibleIndex,
      [ToastRootCssVars.offsetY]: `${offsetY}px`,
      [ToastRootCssVars.height]: toast.height ? `${toast.height}px` : void 0
    }
  };
  const toastRoot = reactExports.useMemo(() => ({
    rootRef,
    toast,
    titleId,
    setTitleId,
    descriptionId,
    setDescriptionId,
    swiping: isSwiping,
    swipeDirection: currentSwipeDirection,
    recalculateHeight,
    index: domIndex,
    visibleIndex,
    expanded
  }), [toast, titleId, descriptionId, isSwiping, currentSwipeDirection, recalculateHeight, domIndex, visibleIndex, expanded]);
  const state = reactExports.useMemo(() => ({
    transitionStatus: toast.transitionStatus,
    expanded,
    limited: toast.limited || false,
    type: toast.type,
    swiping: toastRoot.swiping,
    swipeDirection: toastRoot.swipeDirection
  }), [expanded, toast.transitionStatus, toast.limited, toast.type, toastRoot.swiping, toastRoot.swipeDirection]);
  const element = useRenderElement("div", componentProps, {
    ref: [forwardedRef, toastRoot.rootRef],
    state,
    stateAttributesMapping: stateAttributesMapping$6,
    props: [defaultProps, elementProps]
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ToastRootContext.Provider, {
    value: toastRoot,
    children: element
  });
});
const ToastContent = /* @__PURE__ */ reactExports.forwardRef(function ToastContent2(componentProps, forwardedRef) {
  const {
    render,
    className,
    ...elementProps
  } = componentProps;
  const {
    visibleIndex,
    expanded,
    recalculateHeight
  } = useToastRootContext();
  const contentRef = reactExports.useRef(null);
  useIsoLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) {
      return void 0;
    }
    recalculateHeight();
    if (typeof ResizeObserver !== "function" || typeof MutationObserver !== "function") {
      return void 0;
    }
    const resizeObserver = new ResizeObserver(() => recalculateHeight(true));
    const mutationObserver = new MutationObserver(() => recalculateHeight(true));
    resizeObserver.observe(node);
    mutationObserver.observe(node, {
      childList: true,
      subtree: true,
      characterData: true
    });
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [recalculateHeight]);
  const behind = visibleIndex > 0;
  const state = reactExports.useMemo(() => ({
    expanded,
    behind
  }), [expanded, behind]);
  const element = useRenderElement("div", componentProps, {
    ref: [forwardedRef, contentRef],
    state,
    props: elementProps
  });
  return element;
});
const ToastDescription = /* @__PURE__ */ reactExports.forwardRef(function ToastDescription2(componentProps, forwardedRef) {
  const {
    render,
    className,
    id: idProp,
    children: childrenProp,
    ...elementProps
  } = componentProps;
  const {
    toast
  } = useToastRootContext();
  const children = childrenProp ?? toast.description;
  const shouldRender = Boolean(children);
  const id = useId(idProp);
  const {
    setDescriptionId
  } = useToastRootContext();
  useIsoLayoutEffect(() => {
    if (!shouldRender) {
      return void 0;
    }
    setDescriptionId(id);
    return () => {
      setDescriptionId(void 0);
    };
  }, [shouldRender, id, setDescriptionId]);
  const state = reactExports.useMemo(() => ({
    type: toast.type
  }), [toast.type]);
  const element = useRenderElement("p", componentProps, {
    ref: forwardedRef,
    state,
    props: {
      ...elementProps,
      id,
      children
    }
  });
  if (!shouldRender) {
    return null;
  }
  return element;
});
const ToastTitle = /* @__PURE__ */ reactExports.forwardRef(function ToastTitle2(componentProps, forwardedRef) {
  const {
    render,
    className,
    id: idProp,
    children: childrenProp,
    ...elementProps
  } = componentProps;
  const {
    toast
  } = useToastRootContext();
  const children = childrenProp ?? toast.title;
  const shouldRender = Boolean(children);
  const id = useId(idProp);
  const {
    setTitleId
  } = useToastRootContext();
  useIsoLayoutEffect(() => {
    if (!shouldRender) {
      return void 0;
    }
    setTitleId(id);
    return () => {
      setTitleId(void 0);
    };
  }, [shouldRender, id, setTitleId]);
  const state = reactExports.useMemo(() => ({
    type: toast.type
  }), [toast.type]);
  const element = useRenderElement("h2", componentProps, {
    ref: forwardedRef,
    state,
    props: {
      ...elementProps,
      id,
      children
    }
  });
  if (!shouldRender) {
    return null;
  }
  return element;
});
const CompositeRootContext = /* @__PURE__ */ reactExports.createContext(void 0);
function useCompositeRootContext(optional = false) {
  const context = reactExports.useContext(CompositeRootContext);
  if (context === void 0 && !optional) {
    throw new Error(formatErrorMessage(16));
  }
  return context;
}
function useFocusableWhenDisabled(parameters) {
  const {
    focusableWhenDisabled,
    disabled,
    composite = false,
    tabIndex: tabIndexProp = 0,
    isNativeButton
  } = parameters;
  const isFocusableComposite = composite && focusableWhenDisabled !== false;
  const isNonFocusableComposite = composite && focusableWhenDisabled === false;
  const props = reactExports.useMemo(() => {
    const additionalProps = {
      // allow Tabbing away from focusableWhenDisabled elements
      onKeyDown(event) {
        if (disabled && focusableWhenDisabled && event.key !== "Tab") {
          event.preventDefault();
        }
      }
    };
    if (!composite) {
      additionalProps.tabIndex = tabIndexProp;
      if (!isNativeButton && disabled) {
        additionalProps.tabIndex = focusableWhenDisabled ? tabIndexProp : -1;
      }
    }
    if (isNativeButton && (focusableWhenDisabled || isFocusableComposite) || !isNativeButton && disabled) {
      additionalProps["aria-disabled"] = disabled;
    }
    if (isNativeButton && (!focusableWhenDisabled || isNonFocusableComposite)) {
      additionalProps.disabled = disabled;
    }
    return additionalProps;
  }, [composite, disabled, focusableWhenDisabled, isFocusableComposite, isNonFocusableComposite, isNativeButton, tabIndexProp]);
  return {
    props
  };
}
function useButton(parameters = {}) {
  const {
    disabled = false,
    focusableWhenDisabled,
    tabIndex = 0,
    native: isNativeButton = true
  } = parameters;
  const elementRef = reactExports.useRef(null);
  const isCompositeItem = useCompositeRootContext(true) !== void 0;
  const isValidLink = useStableCallback(() => {
    const element = elementRef.current;
    return Boolean(element?.tagName === "A" && element?.href);
  });
  const {
    props: focusableWhenDisabledProps
  } = useFocusableWhenDisabled({
    focusableWhenDisabled,
    disabled,
    composite: isCompositeItem,
    tabIndex,
    isNativeButton
  });
  const updateDisabled = reactExports.useCallback(() => {
    const element = elementRef.current;
    if (!isButtonElement(element)) {
      return;
    }
    if (isCompositeItem && disabled && focusableWhenDisabledProps.disabled === void 0 && element.disabled) {
      element.disabled = false;
    }
  }, [disabled, focusableWhenDisabledProps.disabled, isCompositeItem]);
  useIsoLayoutEffect(updateDisabled, [updateDisabled]);
  const getButtonProps = reactExports.useCallback((externalProps = {}) => {
    const {
      onClick: externalOnClick,
      onMouseDown: externalOnMouseDown,
      onKeyUp: externalOnKeyUp,
      onKeyDown: externalOnKeyDown,
      onPointerDown: externalOnPointerDown,
      ...otherExternalProps
    } = externalProps;
    const type = isNativeButton ? "button" : void 0;
    return mergeProps$1({
      type,
      onClick(event) {
        if (disabled) {
          event.preventDefault();
          return;
        }
        externalOnClick?.(event);
      },
      onMouseDown(event) {
        if (!disabled) {
          externalOnMouseDown?.(event);
        }
      },
      onKeyDown(event) {
        if (!disabled) {
          makeEventPreventable(event);
          externalOnKeyDown?.(event);
        }
        if (event.baseUIHandlerPrevented) {
          return;
        }
        const shouldClick = event.target === event.currentTarget && !isNativeButton && !isValidLink() && !disabled;
        const isEnterKey = event.key === "Enter";
        const isSpaceKey = event.key === " ";
        if (shouldClick) {
          if (isSpaceKey || isEnterKey) {
            event.preventDefault();
          }
          if (isEnterKey) {
            externalOnClick?.(event);
          }
        }
      },
      onKeyUp(event) {
        if (!disabled) {
          makeEventPreventable(event);
          externalOnKeyUp?.(event);
        }
        if (event.baseUIHandlerPrevented) {
          return;
        }
        if (event.target === event.currentTarget && !isNativeButton && !disabled && event.key === " ") {
          externalOnClick?.(event);
        }
      },
      onPointerDown(event) {
        if (disabled) {
          event.preventDefault();
          return;
        }
        externalOnPointerDown?.(event);
      }
    }, !isNativeButton ? {
      role: "button"
    } : void 0, focusableWhenDisabledProps, otherExternalProps);
  }, [disabled, focusableWhenDisabledProps, isNativeButton, isValidLink]);
  const buttonRef = useStableCallback((element) => {
    elementRef.current = element;
    updateDisabled();
  });
  return {
    getButtonProps,
    buttonRef
  };
}
function isButtonElement(elem) {
  return isHTMLElement(elem) && elem.tagName === "BUTTON";
}
const ToastAction = /* @__PURE__ */ reactExports.forwardRef(function ToastAction2(componentProps, forwardedRef) {
  const {
    render,
    className,
    disabled,
    nativeButton = true,
    ...elementProps
  } = componentProps;
  const {
    toast
  } = useToastRootContext();
  const computedChildren = toast.actionProps?.children ?? elementProps.children;
  const shouldRender = Boolean(computedChildren);
  const {
    getButtonProps,
    buttonRef
  } = useButton({
    disabled,
    native: nativeButton
  });
  const state = reactExports.useMemo(() => ({
    type: toast.type
  }), [toast.type]);
  const element = useRenderElement("button", componentProps, {
    ref: [forwardedRef, buttonRef],
    state,
    props: [elementProps, toast.actionProps, getButtonProps, {
      children: computedChildren
    }]
  });
  if (!shouldRender) {
    return null;
  }
  return element;
});
function createEventEmitter() {
  const map = /* @__PURE__ */ new Map();
  return {
    emit(event, data) {
      map.get(event)?.forEach((listener) => listener(data));
    },
    on(event, listener) {
      if (!map.has(event)) {
        map.set(event, /* @__PURE__ */ new Set());
      }
      map.get(event).add(listener);
    },
    off(event, listener) {
      map.get(event)?.delete(listener);
    }
  };
}
class FloatingTreeStore {
  nodesRef = {
    current: []
  };
  events = createEventEmitter();
  addNode(node) {
    this.nodesRef.current.push(node);
  }
  removeNode(node) {
    const index = this.nodesRef.current.findIndex((n) => n === node);
    if (index !== -1) {
      this.nodesRef.current.splice(index, 1);
    }
  }
}
const FloatingNodeContext = /* @__PURE__ */ reactExports.createContext(null);
const FloatingTreeContext = /* @__PURE__ */ reactExports.createContext(null);
const useFloatingParentNodeId = () => reactExports.useContext(FloatingNodeContext)?.id || null;
const useFloatingTree = (externalTree) => {
  const contextTree = reactExports.useContext(FloatingTreeContext);
  return externalTree ?? contextTree;
};
function useFloatingNodeId(externalTree) {
  const id = useId();
  const tree = useFloatingTree(externalTree);
  const parentId = useFloatingParentNodeId();
  useIsoLayoutEffect(() => {
    if (!id) {
      return void 0;
    }
    const node = {
      id,
      parentId
    };
    tree?.addNode(node);
    return () => {
      tree?.removeNode(node);
    };
  }, [tree, id, parentId]);
  return id;
}
function FloatingNode(props) {
  const {
    children,
    id
  } = props;
  const parentId = useFloatingParentNodeId();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingNodeContext.Provider, {
    value: reactExports.useMemo(() => ({
      id,
      parentId
    }), [id, parentId]),
    children
  });
}
function FloatingTree(props) {
  const {
    children,
    externalTree
  } = props;
  const tree = useRefWithInit(() => externalTree ?? new FloatingTreeStore()).current;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingTreeContext.Provider, {
    value: tree,
    children
  });
}
const none = "none";
const triggerPress = "trigger-press";
const triggerHover = "trigger-hover";
const triggerFocus = "trigger-focus";
const outsidePress = "outside-press";
const itemPress = "item-press";
const closePress = "close-press";
const focusOut = "focus-out";
const escapeKey = "escape-key";
const listNavigation = "list-navigation";
const cancelOpen = "cancel-open";
const siblingOpen = "sibling-open";
const imperativeAction = "imperative-action";
function createChangeEventDetails(reason, event, trigger, customProperties) {
  let canceled = false;
  let allowPropagation = false;
  const custom = EMPTY_OBJECT;
  const details = {
    reason,
    event: event ?? new Event("base-ui"),
    cancel() {
      canceled = true;
    },
    allowPropagation() {
      allowPropagation = true;
    },
    get isCanceled() {
      return canceled;
    },
    get isPropagationAllowed() {
      return allowPropagation;
    },
    trigger,
    ...custom
  };
  return details;
}
function createAttribute(name) {
  return `data-base-ui-${name}`;
}
function getDelay$1(value, prop, pointerType) {
  if (pointerType && !isMouseLikePointerType(pointerType)) {
    return 0;
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "function") {
    const result = value();
    if (typeof result === "number") {
      return result;
    }
    return result?.[prop];
  }
  return value?.[prop];
}
let rafId = 0;
function enqueueFocus(el, options = {}) {
  const {
    preventScroll = false,
    cancelPrevious = true,
    sync = false
  } = options;
  if (cancelPrevious) {
    cancelAnimationFrame(rafId);
  }
  const exec = () => el?.focus({
    preventScroll
  });
  if (sync) {
    exec();
  } else {
    rafId = requestAnimationFrame(exec);
  }
}
const counters = {
  inert: /* @__PURE__ */ new WeakMap(),
  "aria-hidden": /* @__PURE__ */ new WeakMap(),
  none: /* @__PURE__ */ new WeakMap()
};
function getCounterMap(control) {
  if (control === "inert") {
    return counters.inert;
  }
  if (control === "aria-hidden") {
    return counters["aria-hidden"];
  }
  return counters.none;
}
let uncontrolledElementsSet = /* @__PURE__ */ new WeakSet();
let markerMap = {};
let lockCount = 0;
const unwrapHost = (node) => node && (node.host || unwrapHost(node.parentNode));
const correctElements = (parent, targets) => targets.map((target) => {
  if (parent.contains(target)) {
    return target;
  }
  const correctedTarget = unwrapHost(target);
  if (parent.contains(correctedTarget)) {
    return correctedTarget;
  }
  return null;
}).filter((x) => x != null);
function applyAttributeToOthers(uncorrectedAvoidElements, body, ariaHidden, inert) {
  const markerName = "data-base-ui-inert";
  const controlAttribute = inert ? "inert" : ariaHidden ? "aria-hidden" : null;
  const avoidElements = correctElements(body, uncorrectedAvoidElements);
  const elementsToKeep = /* @__PURE__ */ new Set();
  const elementsToStop = new Set(avoidElements);
  const hiddenElements = [];
  if (!markerMap[markerName]) {
    markerMap[markerName] = /* @__PURE__ */ new WeakMap();
  }
  const markerCounter = markerMap[markerName];
  avoidElements.forEach(keep);
  deep(body);
  elementsToKeep.clear();
  function keep(el) {
    if (!el || elementsToKeep.has(el)) {
      return;
    }
    elementsToKeep.add(el);
    if (el.parentNode) {
      keep(el.parentNode);
    }
  }
  function deep(parent) {
    if (!parent || elementsToStop.has(parent)) {
      return;
    }
    [].forEach.call(parent.children, (node) => {
      if (getNodeName(node) === "script") {
        return;
      }
      if (elementsToKeep.has(node)) {
        deep(node);
      } else {
        const attr2 = controlAttribute ? node.getAttribute(controlAttribute) : null;
        const alreadyHidden = attr2 !== null && attr2 !== "false";
        const counterMap = getCounterMap(controlAttribute);
        const counterValue = (counterMap.get(node) || 0) + 1;
        const markerValue = (markerCounter.get(node) || 0) + 1;
        counterMap.set(node, counterValue);
        markerCounter.set(node, markerValue);
        hiddenElements.push(node);
        if (counterValue === 1 && alreadyHidden) {
          uncontrolledElementsSet.add(node);
        }
        if (markerValue === 1) {
          node.setAttribute(markerName, "");
        }
        if (!alreadyHidden && controlAttribute) {
          node.setAttribute(controlAttribute, controlAttribute === "inert" ? "" : "true");
        }
      }
    });
  }
  lockCount += 1;
  return () => {
    hiddenElements.forEach((element) => {
      const counterMap = getCounterMap(controlAttribute);
      const currentCounterValue = counterMap.get(element) || 0;
      const counterValue = currentCounterValue - 1;
      const markerValue = (markerCounter.get(element) || 0) - 1;
      counterMap.set(element, counterValue);
      markerCounter.set(element, markerValue);
      if (!counterValue) {
        if (!uncontrolledElementsSet.has(element) && controlAttribute) {
          element.removeAttribute(controlAttribute);
        }
        uncontrolledElementsSet.delete(element);
      }
      if (!markerValue) {
        element.removeAttribute(markerName);
      }
    });
    lockCount -= 1;
    if (!lockCount) {
      counters.inert = /* @__PURE__ */ new WeakMap();
      counters["aria-hidden"] = /* @__PURE__ */ new WeakMap();
      counters.none = /* @__PURE__ */ new WeakMap();
      uncontrolledElementsSet = /* @__PURE__ */ new WeakSet();
      markerMap = {};
    }
  };
}
function markOthers(avoidElements, ariaHidden = false, inert = false) {
  const body = getDocument(avoidElements[0]).body;
  return applyAttributeToOthers(avoidElements.concat(Array.from(body.querySelectorAll("[aria-live]"))), body, ariaHidden, inert);
}
const PortalContext = /* @__PURE__ */ reactExports.createContext(null);
const usePortalContext = () => reactExports.useContext(PortalContext);
const attr = createAttribute("portal");
function useFloatingPortalNode(props = {}) {
  const {
    ref,
    container: containerProp,
    componentProps = EMPTY_OBJECT,
    elementProps,
    elementState
  } = props;
  const uniqueId = useId();
  const portalContext = usePortalContext();
  const parentPortalNode = portalContext?.portalNode;
  const [containerElement, setContainerElement] = reactExports.useState(null);
  const [portalNode, setPortalNode] = reactExports.useState(null);
  const setPortalNodeRef = useStableCallback((node) => {
    if (node !== null) {
      setPortalNode(node);
    }
  });
  const containerRef = reactExports.useRef(null);
  useIsoLayoutEffect(() => {
    if (containerProp === null) {
      if (containerRef.current) {
        containerRef.current = null;
        setPortalNode(null);
        setContainerElement(null);
      }
      return;
    }
    if (uniqueId == null) {
      return;
    }
    const resolvedContainer = (containerProp && (isNode(containerProp) ? containerProp : containerProp.current)) ?? parentPortalNode ?? document.body;
    if (resolvedContainer == null) {
      if (containerRef.current) {
        containerRef.current = null;
        setPortalNode(null);
        setContainerElement(null);
      }
      return;
    }
    if (containerRef.current !== resolvedContainer) {
      containerRef.current = resolvedContainer;
      setPortalNode(null);
      setContainerElement(resolvedContainer);
    }
  }, [containerProp, parentPortalNode, uniqueId]);
  const portalElement = useRenderElement("div", componentProps, {
    ref: [ref, setPortalNodeRef],
    state: elementState,
    props: [{
      id: uniqueId,
      [attr]: ""
    }, elementProps]
  });
  const portalSubtree = containerElement && portalElement ? /* @__PURE__ */ reactDomExports.createPortal(portalElement, containerElement) : null;
  return {
    portalNode,
    portalSubtree
  };
}
const FloatingPortal = /* @__PURE__ */ reactExports.forwardRef(function FloatingPortal2(componentProps, forwardedRef) {
  const {
    children,
    container,
    className,
    render,
    renderGuards,
    ...elementProps
  } = componentProps;
  const {
    portalNode,
    portalSubtree
  } = useFloatingPortalNode({
    container,
    ref: forwardedRef,
    componentProps,
    elementProps
  });
  const beforeOutsideRef = reactExports.useRef(null);
  const afterOutsideRef = reactExports.useRef(null);
  const beforeInsideRef = reactExports.useRef(null);
  const afterInsideRef = reactExports.useRef(null);
  const [focusManagerState, setFocusManagerState] = reactExports.useState(null);
  const modal = focusManagerState?.modal;
  const open = focusManagerState?.open;
  const shouldRenderGuards = typeof renderGuards === "boolean" ? renderGuards : !!focusManagerState && !focusManagerState.modal && focusManagerState.open && !!portalNode;
  reactExports.useEffect(() => {
    if (!portalNode || modal) {
      return void 0;
    }
    function onFocus(event) {
      if (portalNode && event.relatedTarget && isOutsideEvent(event)) {
        const focusing = event.type === "focusin";
        const manageFocus = focusing ? enableFocusInside : disableFocusInside;
        manageFocus(portalNode);
      }
    }
    portalNode.addEventListener("focusin", onFocus, true);
    portalNode.addEventListener("focusout", onFocus, true);
    return () => {
      portalNode.removeEventListener("focusin", onFocus, true);
      portalNode.removeEventListener("focusout", onFocus, true);
    };
  }, [portalNode, modal]);
  reactExports.useEffect(() => {
    if (!portalNode || open) {
      return;
    }
    enableFocusInside(portalNode);
  }, [open, portalNode]);
  const portalContextValue = reactExports.useMemo(() => ({
    beforeOutsideRef,
    afterOutsideRef,
    beforeInsideRef,
    afterInsideRef,
    portalNode,
    setFocusManagerState
  }), [portalNode]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, {
    children: [portalSubtree, /* @__PURE__ */ jsxRuntimeExports.jsxs(PortalContext.Provider, {
      value: portalContextValue,
      children: [shouldRenderGuards && portalNode && /* @__PURE__ */ jsxRuntimeExports.jsx(FocusGuard, {
        "data-type": "outside",
        ref: beforeOutsideRef,
        onFocus: (event) => {
          if (isOutsideEvent(event, portalNode)) {
            beforeInsideRef.current?.focus();
          } else {
            const domReference = focusManagerState ? focusManagerState.domReference : null;
            const prevTabbable = getPreviousTabbable(domReference);
            prevTabbable?.focus();
          }
        }
      }), shouldRenderGuards && portalNode && /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
        "aria-owns": portalNode.id,
        style: ownerVisuallyHidden
      }), portalNode && /* @__PURE__ */ reactDomExports.createPortal(children, portalNode), shouldRenderGuards && portalNode && /* @__PURE__ */ jsxRuntimeExports.jsx(FocusGuard, {
        "data-type": "outside",
        ref: afterOutsideRef,
        onFocus: (event) => {
          if (isOutsideEvent(event, portalNode)) {
            afterInsideRef.current?.focus();
          } else {
            const domReference = focusManagerState ? focusManagerState.domReference : null;
            const nextTabbable = getNextTabbable(domReference);
            nextTabbable?.focus();
            if (focusManagerState?.closeOnFocusOut) {
              focusManagerState?.onOpenChange(false, createChangeEventDetails(focusOut, event.nativeEvent));
            }
          }
        }
      })]
    })]
  });
});
function getEventType(event, lastInteractionType) {
  const win = getWindow(event.target);
  if (event instanceof win.KeyboardEvent) {
    return "keyboard";
  }
  if (event instanceof win.FocusEvent) {
    return lastInteractionType || "keyboard";
  }
  if ("pointerType" in event) {
    return event.pointerType || "keyboard";
  }
  if ("touches" in event) {
    return "touch";
  }
  if (event instanceof win.MouseEvent) {
    return lastInteractionType || (event.detail === 0 ? "keyboard" : "mouse");
  }
  return "";
}
const LIST_LIMIT = 20;
let previouslyFocusedElements = [];
function clearDisconnectedPreviouslyFocusedElements() {
  previouslyFocusedElements = previouslyFocusedElements.filter((el) => el.isConnected);
}
function addPreviouslyFocusedElement(element) {
  clearDisconnectedPreviouslyFocusedElements();
  if (element && getNodeName(element) !== "body") {
    previouslyFocusedElements.push(element);
    if (previouslyFocusedElements.length > LIST_LIMIT) {
      previouslyFocusedElements = previouslyFocusedElements.slice(-LIST_LIMIT);
    }
  }
}
function getPreviouslyFocusedElement() {
  clearDisconnectedPreviouslyFocusedElements();
  return previouslyFocusedElements[previouslyFocusedElements.length - 1];
}
function getFirstTabbableElement(container) {
  if (!container) {
    return null;
  }
  const tabbableOptions = getTabbableOptions();
  if (isTabbable(container, tabbableOptions)) {
    return container;
  }
  return tabbable(container, tabbableOptions)[0] || container;
}
function isFocusable(element) {
  if (!element || !element.isConnected) {
    return false;
  }
  if (typeof element.checkVisibility === "function") {
    return element.checkVisibility();
  }
  return getComputedStyle$1(element).display !== "none";
}
function handleTabIndex(floatingFocusElement, orderRef) {
  if (!orderRef.current.includes("floating") && !floatingFocusElement.getAttribute("role")?.includes("dialog")) {
    return;
  }
  const options = getTabbableOptions();
  const focusableElements = focusable(floatingFocusElement, options);
  const tabbableContent = focusableElements.filter((element) => {
    const dataTabIndex = element.getAttribute("data-tabindex") || "";
    return isTabbable(element, options) || element.hasAttribute("data-tabindex") && !dataTabIndex.startsWith("-");
  });
  const tabIndex = floatingFocusElement.getAttribute("tabindex");
  if (orderRef.current.includes("floating") || tabbableContent.length === 0) {
    if (tabIndex !== "0") {
      floatingFocusElement.setAttribute("tabindex", "0");
    }
  } else if (tabIndex !== "-1" || floatingFocusElement.hasAttribute("data-tabindex") && floatingFocusElement.getAttribute("data-tabindex") !== "-1") {
    floatingFocusElement.setAttribute("tabindex", "-1");
    floatingFocusElement.setAttribute("data-tabindex", "-1");
  }
}
function FloatingFocusManager(props) {
  const {
    context,
    children,
    disabled = false,
    order = ["content"],
    initialFocus = true,
    returnFocus = true,
    restoreFocus = false,
    modal = true,
    closeOnFocusOut = true,
    openInteractionType = "",
    getInsideElements: getInsideElementsProp = () => [],
    nextFocusableElement,
    previousFocusableElement,
    beforeContentFocusGuardRef,
    externalTree
  } = props;
  const store = "rootStore" in context ? context.rootStore : context;
  const open = store.useState("open");
  const domReference = store.useState("domReferenceElement");
  const floating = store.useState("floatingElement");
  const {
    events,
    dataRef
  } = store.context;
  const getNodeId = useStableCallback(() => dataRef.current.floatingContext?.nodeId);
  const getInsideElements = useStableCallback(getInsideElementsProp);
  const ignoreInitialFocus = initialFocus === false;
  const isUntrappedTypeableCombobox = isTypeableCombobox(domReference) && ignoreInitialFocus;
  const orderRef = useValueAsRef(order);
  const initialFocusRef = useValueAsRef(initialFocus);
  const returnFocusRef = useValueAsRef(returnFocus);
  const openInteractionTypeRef = useValueAsRef(openInteractionType);
  const tree = useFloatingTree(externalTree);
  const portalContext = usePortalContext();
  const startDismissButtonRef = reactExports.useRef(null);
  const endDismissButtonRef = reactExports.useRef(null);
  const preventReturnFocusRef = reactExports.useRef(false);
  const isPointerDownRef = reactExports.useRef(false);
  const pointerDownOutsideRef = reactExports.useRef(false);
  const tabbableIndexRef = reactExports.useRef(-1);
  const closeTypeRef = reactExports.useRef("");
  const lastInteractionTypeRef = reactExports.useRef("");
  const beforeGuardRef = reactExports.useRef(null);
  const afterGuardRef = reactExports.useRef(null);
  const mergedBeforeGuardRef = useMergedRefs(beforeGuardRef, beforeContentFocusGuardRef, portalContext?.beforeInsideRef);
  const mergedAfterGuardRef = useMergedRefs(afterGuardRef, portalContext?.afterInsideRef);
  const blurTimeout = useTimeout();
  const pointerDownTimeout = useTimeout();
  const restoreFocusFrame = useAnimationFrame();
  const isInsidePortal = portalContext != null;
  const floatingFocusElement = getFloatingFocusElement(floating);
  const getTabbableContent = useStableCallback((container = floatingFocusElement) => {
    return container ? tabbable(container, getTabbableOptions()) : [];
  });
  const getTabbableElements = useStableCallback((container) => {
    const content = getTabbableContent(container);
    return orderRef.current.map(() => content).filter(Boolean).flat();
  });
  reactExports.useEffect(() => {
    if (disabled) {
      return void 0;
    }
    if (!modal) {
      return void 0;
    }
    function onKeyDown(event) {
      if (event.key === "Tab") {
        if (contains(floatingFocusElement, activeElement(getDocument(floatingFocusElement))) && getTabbableContent().length === 0 && !isUntrappedTypeableCombobox) {
          stopEvent(event);
        }
      }
    }
    const doc = getDocument(floatingFocusElement);
    doc.addEventListener("keydown", onKeyDown);
    return () => {
      doc.removeEventListener("keydown", onKeyDown);
    };
  }, [disabled, domReference, floatingFocusElement, modal, orderRef, isUntrappedTypeableCombobox, getTabbableContent, getTabbableElements]);
  reactExports.useEffect(() => {
    if (disabled) {
      return void 0;
    }
    if (!floating) {
      return void 0;
    }
    function handleFocusIn(event) {
      const target = getTarget(event);
      const tabbableContent = getTabbableContent();
      const tabbableIndex = tabbableContent.indexOf(target);
      if (tabbableIndex !== -1) {
        tabbableIndexRef.current = tabbableIndex;
      }
    }
    floating.addEventListener("focusin", handleFocusIn);
    return () => {
      floating.removeEventListener("focusin", handleFocusIn);
    };
  }, [disabled, floating, getTabbableContent]);
  reactExports.useEffect(() => {
    if (disabled || !open) {
      return void 0;
    }
    const doc = getDocument(floatingFocusElement);
    function clearPointerDownOutside() {
      pointerDownOutsideRef.current = false;
    }
    function onPointerDown(event) {
      const target = getTarget(event);
      const pointerTargetInside = contains(floating, target) || contains(domReference, target) || contains(portalContext?.portalNode, target);
      pointerDownOutsideRef.current = !pointerTargetInside;
      lastInteractionTypeRef.current = event.pointerType || "keyboard";
    }
    function onKeyDown() {
      lastInteractionTypeRef.current = "keyboard";
    }
    doc.addEventListener("pointerdown", onPointerDown, true);
    doc.addEventListener("pointerup", clearPointerDownOutside, true);
    doc.addEventListener("pointercancel", clearPointerDownOutside, true);
    doc.addEventListener("keydown", onKeyDown, true);
    return () => {
      doc.removeEventListener("pointerdown", onPointerDown, true);
      doc.removeEventListener("pointerup", clearPointerDownOutside, true);
      doc.removeEventListener("pointercancel", clearPointerDownOutside, true);
      doc.removeEventListener("keydown", onKeyDown, true);
    };
  }, [disabled, floating, domReference, floatingFocusElement, open, portalContext]);
  reactExports.useEffect(() => {
    if (disabled) {
      return void 0;
    }
    if (!closeOnFocusOut) {
      return void 0;
    }
    function handlePointerDown() {
      isPointerDownRef.current = true;
      pointerDownTimeout.start(0, () => {
        isPointerDownRef.current = false;
      });
    }
    function handleFocusOutside(event) {
      const relatedTarget = event.relatedTarget;
      const currentTarget = event.currentTarget;
      const target = getTarget(event);
      queueMicrotask(() => {
        const nodeId = getNodeId();
        const triggers = store.context.triggerElements;
        const isRelatedFocusGuard = relatedTarget?.hasAttribute(createAttribute("focus-guard")) && [beforeGuardRef.current, afterGuardRef.current, portalContext?.beforeInsideRef.current, portalContext?.afterInsideRef.current, portalContext?.beforeOutsideRef.current, portalContext?.afterOutsideRef.current, resolveRef(previousFocusableElement), resolveRef(nextFocusableElement)].includes(relatedTarget);
        const movedToUnrelatedNode = !(contains(domReference, relatedTarget) || contains(floating, relatedTarget) || contains(relatedTarget, floating) || contains(portalContext?.portalNode, relatedTarget) || relatedTarget != null && triggers.hasElement(relatedTarget) || triggers.hasMatchingElement((trigger) => contains(trigger, relatedTarget)) || isRelatedFocusGuard || tree && (getNodeChildren(tree.nodesRef.current, nodeId).find((node) => contains(node.context?.elements.floating, relatedTarget) || contains(node.context?.elements.domReference, relatedTarget)) || getNodeAncestors(tree.nodesRef.current, nodeId).find((node) => [node.context?.elements.floating, getFloatingFocusElement(node.context?.elements.floating)].includes(relatedTarget) || node.context?.elements.domReference === relatedTarget)));
        if (currentTarget === domReference && floatingFocusElement) {
          handleTabIndex(floatingFocusElement, orderRef);
        }
        if (restoreFocus && currentTarget !== domReference && !isFocusable(target) && activeElement(getDocument(floatingFocusElement)) === getDocument(floatingFocusElement).body) {
          if (isHTMLElement(floatingFocusElement)) {
            floatingFocusElement.focus();
            if (restoreFocus === "popup") {
              restoreFocusFrame.request(() => {
                floatingFocusElement.focus();
              });
              return;
            }
          }
          const prevTabbableIndex = tabbableIndexRef.current;
          const tabbableContent = getTabbableContent();
          const nodeToFocus = tabbableContent[prevTabbableIndex] || tabbableContent[tabbableContent.length - 1] || floatingFocusElement;
          if (isHTMLElement(nodeToFocus)) {
            nodeToFocus.focus();
          }
        }
        if (dataRef.current.insideReactTree) {
          dataRef.current.insideReactTree = false;
          return;
        }
        if ((isUntrappedTypeableCombobox ? true : !modal) && relatedTarget && movedToUnrelatedNode && !isPointerDownRef.current && // Fix React 18 Strict Mode returnFocus due to double rendering.
        // For an "untrapped" typeable combobox (input role=combobox with
        // initialFocus=false), re-opening the popup and tabbing out should still close it even
        // when the previously focused element (e.g. the next tabbable outside the popup) is
        // focused again. Otherwise, the popup remains open on the second Tab sequence:
        // click input -> Tab (closes) -> click input -> Tab.
        // Allow closing when `isUntrappedTypeableCombobox` regardless of the previously focused element.
        (isUntrappedTypeableCombobox || relatedTarget !== getPreviouslyFocusedElement())) {
          preventReturnFocusRef.current = true;
          store.setOpen(false, createChangeEventDetails(focusOut, event));
        }
      });
    }
    function markInsideReactTree() {
      if (pointerDownOutsideRef.current) {
        return;
      }
      dataRef.current.insideReactTree = true;
      blurTimeout.start(0, () => {
        dataRef.current.insideReactTree = false;
      });
    }
    const domReferenceElement = isHTMLElement(domReference) ? domReference : null;
    const cleanups = [];
    if (!floating && !domReferenceElement) {
      return void 0;
    }
    if (domReferenceElement) {
      domReferenceElement.addEventListener("focusout", handleFocusOutside);
      domReferenceElement.addEventListener("pointerdown", handlePointerDown);
      cleanups.push(() => {
        domReferenceElement.removeEventListener("focusout", handleFocusOutside);
        domReferenceElement.removeEventListener("pointerdown", handlePointerDown);
      });
    }
    if (floating) {
      floating.addEventListener("focusout", handleFocusOutside);
      if (portalContext) {
        floating.addEventListener("focusout", markInsideReactTree, true);
        cleanups.push(() => {
          floating.removeEventListener("focusout", markInsideReactTree, true);
        });
      }
      cleanups.push(() => {
        floating.removeEventListener("focusout", handleFocusOutside);
      });
    }
    return () => {
      cleanups.forEach((cleanup) => {
        cleanup();
      });
    };
  }, [disabled, domReference, floating, floatingFocusElement, modal, tree, portalContext, store, closeOnFocusOut, restoreFocus, getTabbableContent, isUntrappedTypeableCombobox, getNodeId, orderRef, dataRef, blurTimeout, pointerDownTimeout, restoreFocusFrame, nextFocusableElement, previousFocusableElement]);
  reactExports.useEffect(() => {
    if (disabled || !floating || !open) {
      return void 0;
    }
    const portalNodes = Array.from(portalContext?.portalNode?.querySelectorAll(`[${createAttribute("portal")}]`) || []);
    const ancestors = tree ? getNodeAncestors(tree.nodesRef.current, getNodeId()) : [];
    const rootAncestorComboboxDomReference = ancestors.find((node) => isTypeableCombobox(node.context?.elements.domReference || null))?.context?.elements.domReference;
    const insideElements = [floating, rootAncestorComboboxDomReference, ...portalNodes, ...getInsideElements(), startDismissButtonRef.current, endDismissButtonRef.current, beforeGuardRef.current, afterGuardRef.current, portalContext?.beforeOutsideRef.current, portalContext?.afterOutsideRef.current, resolveRef(previousFocusableElement), resolveRef(nextFocusableElement), isUntrappedTypeableCombobox ? domReference : null].filter((x) => x != null);
    const cleanup = markOthers(insideElements, modal || isUntrappedTypeableCombobox);
    return () => {
      cleanup();
    };
  }, [open, disabled, domReference, floating, modal, orderRef, portalContext, isUntrappedTypeableCombobox, tree, getNodeId, getInsideElements, nextFocusableElement, previousFocusableElement]);
  useIsoLayoutEffect(() => {
    if (!open || disabled || !isHTMLElement(floatingFocusElement)) {
      return;
    }
    const doc = getDocument(floatingFocusElement);
    const previouslyFocusedElement = activeElement(doc);
    queueMicrotask(() => {
      const focusableElements = getTabbableElements(floatingFocusElement);
      const initialFocusValueOrFn = initialFocusRef.current;
      const resolvedInitialFocus = typeof initialFocusValueOrFn === "function" ? initialFocusValueOrFn(openInteractionTypeRef.current || "") : initialFocusValueOrFn;
      if (resolvedInitialFocus === void 0 || resolvedInitialFocus === false) {
        return;
      }
      let elToFocus;
      if (resolvedInitialFocus === true || resolvedInitialFocus === null) {
        elToFocus = focusableElements[0] || floatingFocusElement;
      } else {
        elToFocus = resolveRef(resolvedInitialFocus);
      }
      elToFocus = elToFocus || focusableElements[0] || floatingFocusElement;
      const focusAlreadyInsideFloatingEl = contains(floatingFocusElement, previouslyFocusedElement);
      if (focusAlreadyInsideFloatingEl) {
        return;
      }
      enqueueFocus(elToFocus, {
        preventScroll: elToFocus === floatingFocusElement
      });
    });
  }, [disabled, open, floatingFocusElement, ignoreInitialFocus, getTabbableElements, initialFocusRef, openInteractionTypeRef]);
  useIsoLayoutEffect(() => {
    if (disabled || !floatingFocusElement) {
      return void 0;
    }
    const doc = getDocument(floatingFocusElement);
    const previouslyFocusedElement = activeElement(doc);
    addPreviouslyFocusedElement(previouslyFocusedElement);
    function onOpenChangeLocal(details) {
      if (!details.open) {
        closeTypeRef.current = getEventType(details.nativeEvent, lastInteractionTypeRef.current);
      }
      if (details.reason === triggerHover && details.nativeEvent.type === "mouseleave") {
        preventReturnFocusRef.current = true;
      }
      if (details.reason !== outsidePress) {
        return;
      }
      if (details.nested) {
        preventReturnFocusRef.current = false;
      } else if (isVirtualClick(details.nativeEvent) || isVirtualPointerEvent(details.nativeEvent)) {
        preventReturnFocusRef.current = false;
      } else {
        let isPreventScrollSupported = false;
        document.createElement("div").focus({
          get preventScroll() {
            isPreventScrollSupported = true;
            return false;
          }
        });
        if (isPreventScrollSupported) {
          preventReturnFocusRef.current = false;
        } else {
          preventReturnFocusRef.current = true;
        }
      }
    }
    events.on("openchange", onOpenChangeLocal);
    const fallbackEl = doc.createElement("span");
    fallbackEl.setAttribute("tabindex", "-1");
    fallbackEl.setAttribute("aria-hidden", "true");
    Object.assign(fallbackEl.style, visuallyHidden);
    if (isInsidePortal && domReference) {
      domReference.insertAdjacentElement("afterend", fallbackEl);
    }
    function getReturnElement() {
      const returnFocusValueOrFn = returnFocusRef.current;
      let resolvedReturnFocusValue = typeof returnFocusValueOrFn === "function" ? returnFocusValueOrFn(closeTypeRef.current) : returnFocusValueOrFn;
      if (resolvedReturnFocusValue === void 0 || resolvedReturnFocusValue === false) {
        return null;
      }
      if (resolvedReturnFocusValue === null) {
        resolvedReturnFocusValue = true;
      }
      if (typeof resolvedReturnFocusValue === "boolean") {
        const el = domReference || getPreviouslyFocusedElement();
        return el && el.isConnected ? el : fallbackEl;
      }
      const fallback = domReference || getPreviouslyFocusedElement() || fallbackEl;
      return resolveRef(resolvedReturnFocusValue) || fallback;
    }
    return () => {
      events.off("openchange", onOpenChangeLocal);
      const activeEl = activeElement(doc);
      const isFocusInsideFloatingTree = contains(floating, activeEl) || tree && getNodeChildren(tree.nodesRef.current, getNodeId(), false).some((node) => contains(node.context?.elements.floating, activeEl));
      const returnElement = getReturnElement();
      queueMicrotask(() => {
        const tabbableReturnElement = getFirstTabbableElement(returnElement);
        const hasExplicitReturnFocus = typeof returnFocusRef.current !== "boolean";
        if (
          // eslint-disable-next-line react-hooks/exhaustive-deps
          returnFocusRef.current && !preventReturnFocusRef.current && isHTMLElement(tabbableReturnElement) && // If the focus moved somewhere else after mount, avoid returning focus
          // since it likely entered a different element which should be
          // respected: https://github.com/floating-ui/floating-ui/issues/2607
          (!hasExplicitReturnFocus && tabbableReturnElement !== activeEl && activeEl !== doc.body ? isFocusInsideFloatingTree : true)
        ) {
          tabbableReturnElement.focus({
            preventScroll: true
          });
        }
        fallbackEl.remove();
      });
    };
  }, [disabled, floating, floatingFocusElement, returnFocusRef, dataRef, events, tree, isInsidePortal, domReference, getNodeId]);
  reactExports.useEffect(() => {
    queueMicrotask(() => {
      preventReturnFocusRef.current = false;
    });
  }, [disabled]);
  reactExports.useEffect(() => {
    if (disabled || !open) {
      return void 0;
    }
    function handlePointerDown(event) {
      const target = getTarget(event);
      if (target?.closest(`[${CLICK_TRIGGER_IDENTIFIER}]`)) {
        isPointerDownRef.current = true;
      }
    }
    const doc = getDocument(floatingFocusElement);
    doc.addEventListener("pointerdown", handlePointerDown, true);
    return () => {
      doc.removeEventListener("pointerdown", handlePointerDown, true);
    };
  }, [disabled, open, floatingFocusElement]);
  useIsoLayoutEffect(() => {
    if (disabled) {
      return void 0;
    }
    if (!portalContext) {
      return void 0;
    }
    portalContext.setFocusManagerState({
      modal,
      closeOnFocusOut,
      open,
      onOpenChange: store.setOpen,
      domReference
    });
    return () => {
      portalContext.setFocusManagerState(null);
    };
  }, [disabled, portalContext, modal, open, store, closeOnFocusOut, domReference]);
  useIsoLayoutEffect(() => {
    if (disabled || !floatingFocusElement) {
      return void 0;
    }
    handleTabIndex(floatingFocusElement, orderRef);
    return () => {
      queueMicrotask(clearDisconnectedPreviouslyFocusedElements);
    };
  }, [disabled, floatingFocusElement, orderRef]);
  const shouldRenderGuards = !disabled && (modal ? !isUntrappedTypeableCombobox : true) && (isInsidePortal || modal);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, {
    children: [shouldRenderGuards && /* @__PURE__ */ jsxRuntimeExports.jsx(FocusGuard, {
      "data-type": "inside",
      ref: mergedBeforeGuardRef,
      onFocus: (event) => {
        if (modal) {
          const els = getTabbableElements();
          enqueueFocus(els[els.length - 1]);
        } else if (portalContext?.portalNode) {
          preventReturnFocusRef.current = false;
          if (isOutsideEvent(event, portalContext.portalNode)) {
            const nextTabbable = getNextTabbable(domReference);
            nextTabbable?.focus();
          } else {
            resolveRef(previousFocusableElement ?? portalContext.beforeOutsideRef)?.focus();
          }
        }
      }
    }), children, shouldRenderGuards && /* @__PURE__ */ jsxRuntimeExports.jsx(FocusGuard, {
      "data-type": "inside",
      ref: mergedAfterGuardRef,
      onFocus: (event) => {
        if (modal) {
          enqueueFocus(getTabbableElements()[0]);
        } else if (portalContext?.portalNode) {
          if (closeOnFocusOut) {
            preventReturnFocusRef.current = true;
          }
          if (isOutsideEvent(event, portalContext.portalNode)) {
            const prevTabbable = getPreviousTabbable(domReference);
            prevTabbable?.focus();
          } else {
            resolveRef(nextFocusableElement ?? portalContext.afterOutsideRef)?.focus();
          }
        }
      }
    })]
  });
}
function useClick(context, props = {}) {
  const store = "rootStore" in context ? context.rootStore : context;
  const dataRef = store.context.dataRef;
  const {
    enabled = true,
    event: eventOption = "click",
    toggle = true,
    ignoreMouse = false,
    stickIfOpen = true,
    touchOpenDelay = 0
  } = props;
  const pointerTypeRef = reactExports.useRef(void 0);
  const frame = useAnimationFrame();
  const touchOpenTimeout = useTimeout();
  const reference = reactExports.useMemo(() => ({
    onPointerDown(event) {
      pointerTypeRef.current = event.pointerType;
    },
    onMouseDown(event) {
      const pointerType = pointerTypeRef.current;
      const nativeEvent = event.nativeEvent;
      const open = store.select("open");
      if (event.button !== 0 || eventOption === "click" || isMouseLikePointerType(pointerType, true) && ignoreMouse) {
        return;
      }
      const openEvent = dataRef.current.openEvent;
      const openEventType = openEvent?.type;
      const hasClickedOnInactiveTrigger = store.select("domReferenceElement") !== event.currentTarget;
      const nextOpen = open && hasClickedOnInactiveTrigger || !(open && toggle && (openEvent && stickIfOpen ? openEventType === "click" || openEventType === "mousedown" : true));
      if (isTypeableElement(nativeEvent.target)) {
        const details = createChangeEventDetails(triggerPress, nativeEvent, nativeEvent.target);
        if (nextOpen && pointerType === "touch" && touchOpenDelay > 0) {
          touchOpenTimeout.start(touchOpenDelay, () => {
            store.setOpen(true, details);
          });
        } else {
          store.setOpen(nextOpen, details);
        }
        return;
      }
      const eventCurrentTarget = event.currentTarget;
      frame.request(() => {
        const details = createChangeEventDetails(triggerPress, nativeEvent, eventCurrentTarget);
        if (nextOpen && pointerType === "touch" && touchOpenDelay > 0) {
          touchOpenTimeout.start(touchOpenDelay, () => {
            store.setOpen(true, details);
          });
        } else {
          store.setOpen(nextOpen, details);
        }
      });
    },
    onClick(event) {
      if (eventOption === "mousedown-only") {
        return;
      }
      const pointerType = pointerTypeRef.current;
      if (eventOption === "mousedown" && pointerType) {
        pointerTypeRef.current = void 0;
        return;
      }
      if (isMouseLikePointerType(pointerType, true) && ignoreMouse) {
        return;
      }
      const open = store.select("open");
      const openEvent = dataRef.current.openEvent;
      const hasClickedOnInactiveTrigger = store.select("domReferenceElement") !== event.currentTarget;
      const nextOpen = open && hasClickedOnInactiveTrigger || !(open && toggle && (openEvent && stickIfOpen ? isClickLikeEvent(openEvent) : true));
      const details = createChangeEventDetails(triggerPress, event.nativeEvent, event.currentTarget);
      if (nextOpen && pointerType === "touch" && touchOpenDelay > 0) {
        touchOpenTimeout.start(touchOpenDelay, () => {
          store.setOpen(true, details);
        });
      } else {
        store.setOpen(nextOpen, details);
      }
    },
    onKeyDown() {
      pointerTypeRef.current = void 0;
    }
  }), [dataRef, eventOption, ignoreMouse, store, stickIfOpen, toggle, frame, touchOpenTimeout, touchOpenDelay]);
  return reactExports.useMemo(() => enabled ? {
    reference
  } : EMPTY_OBJECT, [enabled, reference]);
}
const bubbleHandlerKeys = {
  intentional: "onClick",
  sloppy: "onPointerDown"
};
function normalizeProp(normalizable) {
  return {
    escapeKey: typeof normalizable === "boolean" ? normalizable : normalizable?.escapeKey ?? false,
    outsidePress: typeof normalizable === "boolean" ? normalizable : normalizable?.outsidePress ?? true
  };
}
function useDismiss(context, props = {}) {
  const store = "rootStore" in context ? context.rootStore : context;
  const open = store.useState("open");
  const floatingElement = store.useState("floatingElement");
  const referenceElement = store.useState("referenceElement");
  const domReferenceElement = store.useState("domReferenceElement");
  const {
    onOpenChange,
    dataRef
  } = store.context;
  const {
    enabled = true,
    escapeKey: escapeKey$1 = true,
    outsidePress: outsidePressProp = true,
    outsidePressEvent = "sloppy",
    referencePress = false,
    referencePressEvent = "sloppy",
    ancestorScroll = false,
    bubbles,
    externalTree
  } = props;
  const tree = useFloatingTree(externalTree);
  const outsidePressFn = useStableCallback(typeof outsidePressProp === "function" ? outsidePressProp : () => false);
  const outsidePress$1 = typeof outsidePressProp === "function" ? outsidePressFn : outsidePressProp;
  const endedOrStartedInsideRef = reactExports.useRef(false);
  const {
    escapeKey: escapeKeyBubbles,
    outsidePress: outsidePressBubbles
  } = normalizeProp(bubbles);
  const touchStateRef = reactExports.useRef(null);
  const cancelDismissOnEndTimeout = useTimeout();
  const clearInsideReactTreeTimeout = useTimeout();
  const clearInsideReactTree = useStableCallback(() => {
    clearInsideReactTreeTimeout.clear();
    dataRef.current.insideReactTree = false;
  });
  const isComposingRef = reactExports.useRef(false);
  const currentPointerTypeRef = reactExports.useRef("");
  const trackPointerType = useStableCallback((event) => {
    currentPointerTypeRef.current = event.pointerType;
  });
  const getOutsidePressEvent = useStableCallback(() => {
    const type = currentPointerTypeRef.current;
    const computedType = type === "pen" || !type ? "mouse" : type;
    const resolved = typeof outsidePressEvent === "function" ? outsidePressEvent() : outsidePressEvent;
    if (typeof resolved === "string") {
      return resolved;
    }
    return resolved[computedType];
  });
  const closeOnEscapeKeyDown = useStableCallback((event) => {
    if (!open || !enabled || !escapeKey$1 || event.key !== "Escape") {
      return;
    }
    if (isComposingRef.current) {
      return;
    }
    const nodeId = dataRef.current.floatingContext?.nodeId;
    const children = tree ? getNodeChildren(tree.nodesRef.current, nodeId) : [];
    if (!escapeKeyBubbles) {
      if (children.length > 0) {
        let shouldDismiss = true;
        children.forEach((child) => {
          if (child.context?.open && !child.context.dataRef.current.__escapeKeyBubbles) {
            shouldDismiss = false;
          }
        });
        if (!shouldDismiss) {
          return;
        }
      }
    }
    const native = isReactEvent(event) ? event.nativeEvent : event;
    const eventDetails = createChangeEventDetails(escapeKey, native);
    store.setOpen(false, eventDetails);
    if (!escapeKeyBubbles && !eventDetails.isPropagationAllowed) {
      event.stopPropagation();
    }
  });
  const shouldIgnoreEvent = useStableCallback((event) => {
    const computedOutsidePressEvent = getOutsidePressEvent();
    return computedOutsidePressEvent === "intentional" && event.type !== "click" || computedOutsidePressEvent === "sloppy" && event.type === "click";
  });
  const markInsideReactTree = useStableCallback(() => {
    dataRef.current.insideReactTree = true;
    clearInsideReactTreeTimeout.start(0, clearInsideReactTree);
  });
  const closeOnPressOutside = useStableCallback((event, endedOrStartedInside = false) => {
    if (shouldIgnoreEvent(event)) {
      clearInsideReactTree();
      return;
    }
    if (dataRef.current.insideReactTree) {
      clearInsideReactTree();
      return;
    }
    if (getOutsidePressEvent() === "intentional" && endedOrStartedInside) {
      return;
    }
    if (typeof outsidePress$1 === "function" && !outsidePress$1(event)) {
      return;
    }
    const target = getTarget(event);
    const inertSelector = `[${createAttribute("inert")}]`;
    const markers = getDocument(store.select("floatingElement")).querySelectorAll(inertSelector);
    const triggers = store.context.triggerElements;
    if (target && (triggers.hasElement(target) || triggers.hasMatchingElement((trigger) => contains(trigger, target)))) {
      return;
    }
    let targetRootAncestor = isElement(target) ? target : null;
    while (targetRootAncestor && !isLastTraversableNode(targetRootAncestor)) {
      const nextParent = getParentNode(targetRootAncestor);
      if (isLastTraversableNode(nextParent) || !isElement(nextParent)) {
        break;
      }
      targetRootAncestor = nextParent;
    }
    if (markers.length && isElement(target) && !isRootElement(target) && // Clicked on a direct ancestor (e.g. FloatingOverlay).
    !contains(target, store.select("floatingElement")) && // If the target root element contains none of the markers, then the
    // element was injected after the floating element rendered.
    Array.from(markers).every((marker) => !contains(targetRootAncestor, marker))) {
      return;
    }
    if (isHTMLElement(target) && !("touches" in event)) {
      const lastTraversableNode = isLastTraversableNode(target);
      const style = getComputedStyle$1(target);
      const scrollRe = /auto|scroll/;
      const isScrollableX = lastTraversableNode || scrollRe.test(style.overflowX);
      const isScrollableY = lastTraversableNode || scrollRe.test(style.overflowY);
      const canScrollX = isScrollableX && target.clientWidth > 0 && target.scrollWidth > target.clientWidth;
      const canScrollY = isScrollableY && target.clientHeight > 0 && target.scrollHeight > target.clientHeight;
      const isRTL = style.direction === "rtl";
      const pressedVerticalScrollbar = canScrollY && (isRTL ? event.offsetX <= target.offsetWidth - target.clientWidth : event.offsetX > target.clientWidth);
      const pressedHorizontalScrollbar = canScrollX && event.offsetY > target.clientHeight;
      if (pressedVerticalScrollbar || pressedHorizontalScrollbar) {
        return;
      }
    }
    const nodeId = dataRef.current.floatingContext?.nodeId;
    const targetIsInsideChildren = tree && getNodeChildren(tree.nodesRef.current, nodeId).some((node) => isEventTargetWithin(event, node.context?.elements.floating));
    if (isEventTargetWithin(event, store.select("floatingElement")) || isEventTargetWithin(event, store.select("domReferenceElement")) || targetIsInsideChildren) {
      return;
    }
    const children = tree ? getNodeChildren(tree.nodesRef.current, nodeId) : [];
    if (children.length > 0) {
      let shouldDismiss = true;
      children.forEach((child) => {
        if (child.context?.open && !child.context.dataRef.current.__outsidePressBubbles) {
          shouldDismiss = false;
        }
      });
      if (!shouldDismiss) {
        return;
      }
    }
    store.setOpen(false, createChangeEventDetails(outsidePress, event));
    clearInsideReactTree();
  });
  const handlePointerDown = useStableCallback((event) => {
    if (getOutsidePressEvent() !== "sloppy" || event.pointerType === "touch" || !store.select("open") || !enabled || isEventTargetWithin(event, store.select("floatingElement")) || isEventTargetWithin(event, store.select("domReferenceElement"))) {
      return;
    }
    closeOnPressOutside(event);
  });
  const handleTouchStart = useStableCallback((event) => {
    if (getOutsidePressEvent() !== "sloppy" || !store.select("open") || !enabled || isEventTargetWithin(event, store.select("floatingElement")) || isEventTargetWithin(event, store.select("domReferenceElement"))) {
      return;
    }
    const touch = event.touches[0];
    if (touch) {
      touchStateRef.current = {
        startTime: Date.now(),
        startX: touch.clientX,
        startY: touch.clientY,
        dismissOnTouchEnd: false,
        dismissOnMouseDown: true
      };
      cancelDismissOnEndTimeout.start(1e3, () => {
        if (touchStateRef.current) {
          touchStateRef.current.dismissOnTouchEnd = false;
          touchStateRef.current.dismissOnMouseDown = false;
        }
      });
    }
  });
  const handleTouchStartCapture = useStableCallback((event) => {
    const target = getTarget(event);
    function callback() {
      handleTouchStart(event);
      target?.removeEventListener(event.type, callback);
    }
    target?.addEventListener(event.type, callback);
  });
  const closeOnPressOutsideCapture = useStableCallback((event) => {
    const endedOrStartedInside = endedOrStartedInsideRef.current;
    endedOrStartedInsideRef.current = false;
    cancelDismissOnEndTimeout.clear();
    if (event.type === "mousedown" && touchStateRef.current && !touchStateRef.current.dismissOnMouseDown) {
      return;
    }
    const target = getTarget(event);
    function callback() {
      if (event.type === "pointerdown") {
        handlePointerDown(event);
      } else {
        closeOnPressOutside(event, endedOrStartedInside);
      }
      target?.removeEventListener(event.type, callback);
    }
    target?.addEventListener(event.type, callback);
  });
  const handleTouchMove = useStableCallback((event) => {
    if (getOutsidePressEvent() !== "sloppy" || !touchStateRef.current || isEventTargetWithin(event, store.select("floatingElement")) || isEventTargetWithin(event, store.select("domReferenceElement"))) {
      return;
    }
    const touch = event.touches[0];
    if (!touch) {
      return;
    }
    const deltaX = Math.abs(touch.clientX - touchStateRef.current.startX);
    const deltaY = Math.abs(touch.clientY - touchStateRef.current.startY);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (distance > 5) {
      touchStateRef.current.dismissOnTouchEnd = true;
    }
    if (distance > 10) {
      closeOnPressOutside(event);
      cancelDismissOnEndTimeout.clear();
      touchStateRef.current = null;
    }
  });
  const handleTouchMoveCapture = useStableCallback((event) => {
    const target = getTarget(event);
    function callback() {
      handleTouchMove(event);
      target?.removeEventListener(event.type, callback);
    }
    target?.addEventListener(event.type, callback);
  });
  const handleTouchEnd = useStableCallback((event) => {
    if (getOutsidePressEvent() !== "sloppy" || !touchStateRef.current || isEventTargetWithin(event, store.select("floatingElement")) || isEventTargetWithin(event, store.select("domReferenceElement"))) {
      return;
    }
    if (touchStateRef.current.dismissOnTouchEnd) {
      closeOnPressOutside(event);
    }
    cancelDismissOnEndTimeout.clear();
    touchStateRef.current = null;
  });
  const handleTouchEndCapture = useStableCallback((event) => {
    const target = getTarget(event);
    function callback() {
      handleTouchEnd(event);
      target?.removeEventListener(event.type, callback);
    }
    target?.addEventListener(event.type, callback);
  });
  reactExports.useEffect(() => {
    if (!open || !enabled) {
      return void 0;
    }
    dataRef.current.__escapeKeyBubbles = escapeKeyBubbles;
    dataRef.current.__outsidePressBubbles = outsidePressBubbles;
    const compositionTimeout = new Timeout();
    function onScroll(event) {
      store.setOpen(false, createChangeEventDetails(none, event));
    }
    function handleCompositionStart() {
      compositionTimeout.clear();
      isComposingRef.current = true;
    }
    function handleCompositionEnd() {
      compositionTimeout.start(
        // 0ms or 1ms don't work in Safari. 5ms appears to consistently work.
        // Only apply to WebKit for the test to remain 0ms.
        isWebKit() ? 5 : 0,
        () => {
          isComposingRef.current = false;
        }
      );
    }
    const doc = getDocument(floatingElement);
    doc.addEventListener("pointerdown", trackPointerType, true);
    if (escapeKey$1) {
      doc.addEventListener("keydown", closeOnEscapeKeyDown);
      doc.addEventListener("compositionstart", handleCompositionStart);
      doc.addEventListener("compositionend", handleCompositionEnd);
    }
    if (outsidePress$1) {
      doc.addEventListener("click", closeOnPressOutsideCapture, true);
      doc.addEventListener("pointerdown", closeOnPressOutsideCapture, true);
      doc.addEventListener("touchstart", handleTouchStartCapture, true);
      doc.addEventListener("touchmove", handleTouchMoveCapture, true);
      doc.addEventListener("touchend", handleTouchEndCapture, true);
      doc.addEventListener("mousedown", closeOnPressOutsideCapture, true);
    }
    let ancestors = [];
    if (ancestorScroll) {
      if (isElement(domReferenceElement)) {
        ancestors = getOverflowAncestors(domReferenceElement);
      }
      if (isElement(floatingElement)) {
        ancestors = ancestors.concat(getOverflowAncestors(floatingElement));
      }
      if (!isElement(referenceElement) && referenceElement && referenceElement.contextElement) {
        ancestors = ancestors.concat(getOverflowAncestors(referenceElement.contextElement));
      }
    }
    ancestors = ancestors.filter((ancestor) => ancestor !== doc.defaultView?.visualViewport);
    ancestors.forEach((ancestor) => {
      ancestor.addEventListener("scroll", onScroll, {
        passive: true
      });
    });
    return () => {
      doc.removeEventListener("pointerdown", trackPointerType, true);
      if (escapeKey$1) {
        doc.removeEventListener("keydown", closeOnEscapeKeyDown);
        doc.removeEventListener("compositionstart", handleCompositionStart);
        doc.removeEventListener("compositionend", handleCompositionEnd);
      }
      if (outsidePress$1) {
        doc.removeEventListener("click", closeOnPressOutsideCapture, true);
        doc.removeEventListener("pointerdown", closeOnPressOutsideCapture, true);
        doc.removeEventListener("touchstart", handleTouchStartCapture, true);
        doc.removeEventListener("touchmove", handleTouchMoveCapture, true);
        doc.removeEventListener("touchend", handleTouchEndCapture, true);
        doc.removeEventListener("mousedown", closeOnPressOutsideCapture, true);
      }
      ancestors.forEach((ancestor) => {
        ancestor.removeEventListener("scroll", onScroll);
      });
      compositionTimeout.clear();
      endedOrStartedInsideRef.current = false;
    };
  }, [dataRef, floatingElement, referenceElement, domReferenceElement, escapeKey$1, outsidePress$1, open, onOpenChange, ancestorScroll, enabled, escapeKeyBubbles, outsidePressBubbles, closeOnEscapeKeyDown, closeOnPressOutside, closeOnPressOutsideCapture, handlePointerDown, handleTouchStartCapture, handleTouchMoveCapture, handleTouchEndCapture, trackPointerType, store]);
  reactExports.useEffect(clearInsideReactTree, [outsidePress$1, clearInsideReactTree]);
  const reference = reactExports.useMemo(() => ({
    onKeyDown: closeOnEscapeKeyDown,
    ...referencePress && {
      [bubbleHandlerKeys[referencePressEvent]]: (event) => {
        store.setOpen(false, createChangeEventDetails(triggerPress, event.nativeEvent));
      },
      ...referencePressEvent !== "intentional" && {
        onClick(event) {
          store.setOpen(false, createChangeEventDetails(triggerPress, event.nativeEvent));
        }
      }
    }
  }), [closeOnEscapeKeyDown, store, referencePress, referencePressEvent]);
  const handlePressedInside = useStableCallback((event) => {
    const target = getTarget(event.nativeEvent);
    if (!contains(store.select("floatingElement"), target) || event.button !== 0) {
      return;
    }
    endedOrStartedInsideRef.current = true;
  });
  const markPressStartedInsideReactTree = useStableCallback((event) => {
    if (!open || !enabled || event.button !== 0) {
      return;
    }
    endedOrStartedInsideRef.current = true;
  });
  const floating = reactExports.useMemo(() => ({
    onKeyDown: closeOnEscapeKeyDown,
    // `onMouseDown` may be blocked if `event.preventDefault()` is called in
    // `onPointerDown`, such as with <NumberField.ScrubArea>.
    // See https://github.com/mui/base-ui/pull/3379
    onPointerDown: handlePressedInside,
    onMouseDown: handlePressedInside,
    onMouseUp: handlePressedInside,
    onClickCapture: markInsideReactTree,
    onMouseDownCapture(event) {
      markInsideReactTree();
      markPressStartedInsideReactTree(event);
    },
    onPointerDownCapture(event) {
      markInsideReactTree();
      markPressStartedInsideReactTree(event);
    },
    onMouseUpCapture: markInsideReactTree,
    onTouchEndCapture: markInsideReactTree,
    onTouchMoveCapture: markInsideReactTree
  }), [closeOnEscapeKeyDown, handlePressedInside, markInsideReactTree, markPressStartedInsideReactTree]);
  return reactExports.useMemo(() => enabled ? {
    reference,
    floating,
    trigger: reference
  } : {}, [enabled, reference, floating]);
}
const selectors$3 = {
  open: createSelector((state) => state.open),
  domReferenceElement: createSelector((state) => state.domReferenceElement),
  referenceElement: createSelector((state) => state.positionReference ?? state.referenceElement),
  floatingElement: createSelector((state) => state.floatingElement),
  floatingId: createSelector((state) => state.floatingId)
};
class FloatingRootStore extends ReactStore {
  constructor(options) {
    const {
      nested,
      noEmit,
      onOpenChange,
      triggerElements,
      ...initialState
    } = options;
    super({
      ...initialState,
      positionReference: initialState.referenceElement,
      domReferenceElement: initialState.referenceElement
    }, {
      onOpenChange,
      dataRef: {
        current: {}
      },
      events: createEventEmitter(),
      nested,
      noEmit,
      triggerElements
    }, selectors$3);
  }
  /**
   * Emits the `openchange` event through the internal event emitter and calls the `onOpenChange` handler with the provided arguments.
   *
   * @param newOpen The new open state.
   * @param eventDetails Details about the event that triggered the open state change.
   */
  setOpen = (newOpen, eventDetails) => {
    if (!newOpen || !this.state.open || // Prevent a pending hover-open from overwriting a click-open event, while allowing
    // click events to upgrade a hover-open.
    isClickLikeEvent(eventDetails.event)) {
      this.context.dataRef.current.openEvent = newOpen ? eventDetails.event : void 0;
    }
    if (!this.context.noEmit) {
      const details = {
        open: newOpen,
        reason: eventDetails.reason,
        nativeEvent: eventDetails.event,
        nested: this.context.nested,
        triggerElement: eventDetails.trigger
      };
      this.context.events.emit("openchange", details);
    }
    this.context.onOpenChange?.(newOpen, eventDetails);
  };
}
function useTransitionStatus(open, enableIdleState = false, deferEndingState = false) {
  const [transitionStatus, setTransitionStatus] = reactExports.useState(open && enableIdleState ? "idle" : void 0);
  const [mounted, setMounted] = reactExports.useState(open);
  if (open && !mounted) {
    setMounted(true);
    setTransitionStatus("starting");
  }
  if (!open && mounted && transitionStatus !== "ending" && !deferEndingState) {
    setTransitionStatus("ending");
  }
  if (!open && !mounted && transitionStatus === "ending") {
    setTransitionStatus(void 0);
  }
  useIsoLayoutEffect(() => {
    if (!open && mounted && transitionStatus !== "ending" && deferEndingState) {
      const frame = AnimationFrame.request(() => {
        setTransitionStatus("ending");
      });
      return () => {
        AnimationFrame.cancel(frame);
      };
    }
    return void 0;
  }, [open, mounted, transitionStatus, deferEndingState]);
  useIsoLayoutEffect(() => {
    if (!open || enableIdleState) {
      return void 0;
    }
    const frame = AnimationFrame.request(() => {
      setTransitionStatus(void 0);
    });
    return () => {
      AnimationFrame.cancel(frame);
    };
  }, [enableIdleState, open]);
  useIsoLayoutEffect(() => {
    if (!open || !enableIdleState) {
      return void 0;
    }
    if (open && mounted && transitionStatus !== "idle") {
      setTransitionStatus("starting");
    }
    const frame = AnimationFrame.request(() => {
      setTransitionStatus("idle");
    });
    return () => {
      AnimationFrame.cancel(frame);
    };
  }, [enableIdleState, open, mounted, setTransitionStatus, transitionStatus]);
  return reactExports.useMemo(() => ({
    mounted,
    setMounted,
    transitionStatus
  }), [mounted, transitionStatus]);
}
function useTriggerRegistration(id, store) {
  const registeredElementIdRef = reactExports.useRef(null);
  const registeredElementRef = reactExports.useRef(null);
  return reactExports.useCallback((element) => {
    if (id === void 0) {
      return;
    }
    if (registeredElementIdRef.current !== null) {
      const registeredId = registeredElementIdRef.current;
      const registeredElement = registeredElementRef.current;
      const currentElement = store.context.triggerElements.getById(registeredId);
      if (registeredElement && currentElement === registeredElement) {
        store.context.triggerElements.delete(registeredId);
      }
      registeredElementIdRef.current = null;
      registeredElementRef.current = null;
    }
    if (element !== null) {
      registeredElementIdRef.current = id;
      registeredElementRef.current = element;
      store.context.triggerElements.add(id, element);
    }
  }, [store, id]);
}
function useTriggerDataForwarding(triggerId, triggerElementRef, store, stateUpdates) {
  const isMountedByThisTrigger = store.useState("isMountedByTrigger", triggerId);
  const baseRegisterTrigger = useTriggerRegistration(triggerId, store);
  const registerTrigger = useStableCallback((element) => {
    baseRegisterTrigger(element);
    if (!element || !store.select("open")) {
      return;
    }
    const activeTriggerId = store.select("activeTriggerId");
    if (activeTriggerId === triggerId) {
      store.update({
        activeTriggerElement: element,
        ...stateUpdates
      });
      return;
    }
    if (activeTriggerId == null) {
      store.update({
        activeTriggerId: triggerId,
        activeTriggerElement: element,
        ...stateUpdates
      });
    }
  });
  useIsoLayoutEffect(() => {
    if (isMountedByThisTrigger) {
      store.update({
        activeTriggerElement: triggerElementRef.current,
        ...stateUpdates
      });
    }
  }, [isMountedByThisTrigger, store, triggerElementRef, ...Object.values(stateUpdates)]);
  return {
    registerTrigger,
    isMountedByThisTrigger
  };
}
function useImplicitActiveTrigger(store) {
  const open = store.useState("open");
  useIsoLayoutEffect(() => {
    if (open && !store.select("activeTriggerId") && store.context.triggerElements.size === 1) {
      const iteratorResult = store.context.triggerElements.entries().next();
      if (!iteratorResult.done) {
        const [implicitTriggerId, implicitTriggerElement] = iteratorResult.value;
        store.update({
          activeTriggerId: implicitTriggerId,
          activeTriggerElement: implicitTriggerElement
        });
      }
    }
  }, [open, store]);
}
function useOpenStateTransitions(open, store, onUnmount) {
  const {
    mounted,
    setMounted,
    transitionStatus
  } = useTransitionStatus(open);
  store.useSyncedValues({
    mounted,
    transitionStatus
  });
  const forceUnmount = useStableCallback(() => {
    setMounted(false);
    store.update({
      activeTriggerId: null,
      activeTriggerElement: null,
      mounted: false
    });
    onUnmount?.();
    store.context.onOpenChangeComplete?.(false);
  });
  const preventUnmountingOnClose = store.useState("preventUnmountingOnClose");
  useOpenChangeComplete({
    enabled: !preventUnmountingOnClose,
    open,
    ref: store.context.popupRef,
    onComplete() {
      if (!open) {
        forceUnmount();
      }
    }
  });
  return {
    forceUnmount,
    transitionStatus
  };
}
class PopupTriggerMap {
  constructor() {
    this.elements = /* @__PURE__ */ new Set();
    this.idMap = /* @__PURE__ */ new Map();
  }
  /**
   * Adds a trigger element with the given ID.
   *
   * Note: The provided element is assumed to not be registered under multiple IDs.
   */
  add(id, element) {
    const existingElement = this.idMap.get(id);
    if (existingElement === element) {
      return;
    }
    if (existingElement !== void 0) {
      this.elements.delete(existingElement);
    }
    this.elements.add(element);
    this.idMap.set(id, element);
  }
  /**
   * Removes the trigger element with the given ID.
   */
  delete(id) {
    const element = this.idMap.get(id);
    if (element) {
      this.elements.delete(element);
      this.idMap.delete(id);
    }
  }
  /**
   * Whether the given element is registered as a trigger.
   */
  hasElement(element) {
    return this.elements.has(element);
  }
  /**
   * Whether there is a registered trigger element matching the given predicate.
   */
  hasMatchingElement(predicate) {
    for (const element of this.elements) {
      if (predicate(element)) {
        return true;
      }
    }
    return false;
  }
  getById(id) {
    return this.idMap.get(id);
  }
  entries() {
    return this.idMap.entries();
  }
  get size() {
    return this.idMap.size;
  }
}
function getEmptyRootContext() {
  return new FloatingRootStore({
    open: false,
    floatingElement: null,
    referenceElement: null,
    triggerElements: new PopupTriggerMap(),
    floatingId: "",
    nested: false,
    noEmit: false,
    onOpenChange: void 0
  });
}
function createInitialPopupStoreState() {
  return {
    open: false,
    mounted: false,
    transitionStatus: "idle",
    floatingRootContext: getEmptyRootContext(),
    preventUnmountingOnClose: false,
    payload: void 0,
    activeTriggerId: null,
    activeTriggerElement: null,
    popupElement: null,
    positionerElement: null,
    activeTriggerProps: EMPTY_OBJECT,
    inactiveTriggerProps: EMPTY_OBJECT,
    popupProps: EMPTY_OBJECT
  };
}
const popupStoreSelectors = {
  open: createSelector((state) => state.open),
  mounted: createSelector((state) => state.mounted),
  transitionStatus: createSelector((state) => state.transitionStatus),
  floatingRootContext: createSelector((state) => state.floatingRootContext),
  preventUnmountingOnClose: createSelector((state) => state.preventUnmountingOnClose),
  payload: createSelector((state) => state.payload),
  activeTriggerId: createSelector((state) => state.activeTriggerId),
  activeTriggerElement: createSelector((state) => state.mounted ? state.activeTriggerElement : null),
  /**
   * Whether the trigger with the given ID was used to open the popup.
   */
  isTriggerActive: createSelector((state, triggerId) => triggerId !== void 0 && state.activeTriggerId === triggerId),
  /**
   * Whether the popup is open and was activated by a trigger with the given ID.
   */
  isOpenedByTrigger: createSelector((state, triggerId) => triggerId !== void 0 && state.activeTriggerId === triggerId && state.open),
  /**
   * Whether the popup is mounted and was activated by a trigger with the given ID.
   */
  isMountedByTrigger: createSelector((state, triggerId) => triggerId !== void 0 && state.activeTriggerId === triggerId && state.mounted),
  triggerProps: createSelector((state, isActive) => isActive ? state.activeTriggerProps : state.inactiveTriggerProps),
  popupProps: createSelector((state) => state.popupProps),
  popupElement: createSelector((state) => state.popupElement),
  positionerElement: createSelector((state) => state.positionerElement)
};
function useFloatingRootContext(options) {
  const {
    open = false,
    onOpenChange,
    elements = {}
  } = options;
  const floatingId = useId();
  const nested = useFloatingParentNodeId() != null;
  const store = useRefWithInit(() => new FloatingRootStore({
    open,
    onOpenChange,
    referenceElement: elements.reference ?? null,
    floatingElement: elements.floating ?? null,
    triggerElements: elements.triggers ?? new PopupTriggerMap(),
    floatingId,
    nested,
    noEmit: options.noEmit || false
  })).current;
  useIsoLayoutEffect(() => {
    const valuesToSync = {
      open,
      floatingId
    };
    if (elements.reference !== void 0) {
      valuesToSync.referenceElement = elements.reference;
      valuesToSync.domReferenceElement = isElement(elements.reference) ? elements.reference : null;
    }
    if (elements.floating !== void 0) {
      valuesToSync.floatingElement = elements.floating;
    }
    store.update(valuesToSync);
  }, [open, floatingId, elements.reference, elements.floating, store]);
  store.context.onOpenChange = onOpenChange;
  store.context.nested = nested;
  store.context.noEmit = options.noEmit || false;
  return store;
}
function useFloating(options = {}) {
  const {
    nodeId,
    externalTree
  } = options;
  const internalRootStore = useFloatingRootContext(options);
  const rootContext = options.rootContext || internalRootStore;
  const rootContextElements = {
    reference: rootContext.useState("referenceElement"),
    floating: rootContext.useState("floatingElement"),
    domReference: rootContext.useState("domReferenceElement")
  };
  const [positionReference, setPositionReferenceRaw] = reactExports.useState(null);
  const domReferenceRef = reactExports.useRef(null);
  const tree = useFloatingTree(externalTree);
  useIsoLayoutEffect(() => {
    if (rootContextElements.domReference) {
      domReferenceRef.current = rootContextElements.domReference;
    }
  }, [rootContextElements.domReference]);
  const position = useFloating$1({
    ...options,
    elements: {
      ...rootContextElements,
      ...positionReference && {
        reference: positionReference
      }
    }
  });
  const setPositionReference = reactExports.useCallback((node) => {
    const computedPositionReference = isElement(node) ? {
      getBoundingClientRect: () => node.getBoundingClientRect(),
      getClientRects: () => node.getClientRects(),
      contextElement: node
    } : node;
    setPositionReferenceRaw(computedPositionReference);
    position.refs.setReference(computedPositionReference);
  }, [position.refs]);
  const [localDomReference, setLocalDomReference] = reactExports.useState(null);
  const [localFloatingElement, setLocalFloatingElement] = reactExports.useState(null);
  rootContext.useSyncedValue("referenceElement", localDomReference);
  rootContext.useSyncedValue("domReferenceElement", isElement(localDomReference) ? localDomReference : null);
  rootContext.useSyncedValue("floatingElement", localFloatingElement);
  const setReference = reactExports.useCallback((node) => {
    if (isElement(node) || node === null) {
      domReferenceRef.current = node;
      setLocalDomReference(node);
    }
    if (isElement(position.refs.reference.current) || position.refs.reference.current === null || // Don't allow setting virtual elements using the old technique back to
    // `null` to support `positionReference` + an unstable `reference`
    // callback ref.
    node !== null && !isElement(node)) {
      position.refs.setReference(node);
    }
  }, [position.refs, setLocalDomReference]);
  const setFloating = reactExports.useCallback((node) => {
    setLocalFloatingElement(node);
    position.refs.setFloating(node);
  }, [position.refs]);
  const refs = reactExports.useMemo(() => ({
    ...position.refs,
    setReference,
    setFloating,
    setPositionReference,
    domReference: domReferenceRef
  }), [position.refs, setReference, setFloating, setPositionReference]);
  const elements = reactExports.useMemo(() => ({
    ...position.elements,
    domReference: rootContextElements.domReference
  }), [position.elements, rootContextElements.domReference]);
  const open = rootContext.useState("open");
  const floatingId = rootContext.useState("floatingId");
  const context = reactExports.useMemo(() => ({
    ...position,
    dataRef: rootContext.context.dataRef,
    open,
    onOpenChange: rootContext.setOpen,
    events: rootContext.context.events,
    floatingId,
    refs,
    elements,
    nodeId,
    rootStore: rootContext
  }), [position, refs, elements, nodeId, rootContext, open, floatingId]);
  useIsoLayoutEffect(() => {
    rootContext.context.dataRef.current.floatingContext = context;
    const node = tree?.nodesRef.current.find((n) => n.id === nodeId);
    if (node) {
      node.context = context;
    }
  });
  return reactExports.useMemo(() => ({
    ...position,
    context,
    refs,
    elements,
    rootStore: rootContext
  }), [position, refs, elements, context, rootContext]);
}
function useSyncedFloatingRootContext(options) {
  const {
    popupStore,
    noEmit = false,
    treatPopupAsFloatingElement = false,
    onOpenChange
  } = options;
  const floatingId = useId();
  const nested = useFloatingParentNodeId() != null;
  const open = popupStore.useState("open");
  const referenceElement = popupStore.useState("activeTriggerElement");
  const floatingElement = popupStore.useState(treatPopupAsFloatingElement ? "popupElement" : "positionerElement");
  const triggerElements = popupStore.context.triggerElements;
  const store = useRefWithInit(() => new FloatingRootStore({
    open,
    referenceElement,
    floatingElement,
    triggerElements,
    onOpenChange,
    floatingId,
    nested,
    noEmit
  })).current;
  useIsoLayoutEffect(() => {
    const valuesToSync = {
      open,
      floatingId,
      referenceElement,
      floatingElement
    };
    if (isElement(referenceElement)) {
      valuesToSync.domReferenceElement = referenceElement;
    }
    if (store.state.positionReference === store.state.referenceElement) {
      valuesToSync.positionReference = referenceElement;
    }
    store.update(valuesToSync);
  }, [open, floatingId, referenceElement, floatingElement, store]);
  store.context.onOpenChange = onOpenChange;
  store.context.nested = nested;
  store.context.noEmit = noEmit;
  return store;
}
const isMacSafari = isMac && isSafari;
function useFocus(context, props = {}) {
  const store = "rootStore" in context ? context.rootStore : context;
  const {
    events,
    dataRef
  } = store.context;
  const {
    enabled = true,
    visibleOnly = true,
    delay
  } = props;
  const blockFocusRef = reactExports.useRef(false);
  const blockedReferenceRef = reactExports.useRef(null);
  const timeout = useTimeout();
  const keyboardModalityRef = reactExports.useRef(true);
  reactExports.useEffect(() => {
    const domReference = store.select("domReferenceElement");
    if (!enabled) {
      return void 0;
    }
    const win = getWindow(domReference);
    function onBlur() {
      const currentDomReference = store.select("domReferenceElement");
      if (!store.select("open") && isHTMLElement(currentDomReference) && currentDomReference === activeElement(getDocument(currentDomReference))) {
        blockFocusRef.current = true;
      }
    }
    function onKeyDown() {
      keyboardModalityRef.current = true;
    }
    function onPointerDown() {
      keyboardModalityRef.current = false;
    }
    win.addEventListener("blur", onBlur);
    if (isMacSafari) {
      win.addEventListener("keydown", onKeyDown, true);
      win.addEventListener("pointerdown", onPointerDown, true);
    }
    return () => {
      win.removeEventListener("blur", onBlur);
      if (isMacSafari) {
        win.removeEventListener("keydown", onKeyDown, true);
        win.removeEventListener("pointerdown", onPointerDown, true);
      }
    };
  }, [store, enabled]);
  reactExports.useEffect(() => {
    if (!enabled) {
      return void 0;
    }
    function onOpenChangeLocal(details) {
      if (details.reason === triggerPress || details.reason === escapeKey) {
        const referenceElement = store.select("domReferenceElement");
        if (isElement(referenceElement)) {
          blockedReferenceRef.current = referenceElement;
          blockFocusRef.current = true;
        }
      }
    }
    events.on("openchange", onOpenChangeLocal);
    return () => {
      events.off("openchange", onOpenChangeLocal);
    };
  }, [events, enabled, store]);
  const reference = reactExports.useMemo(() => ({
    onMouseLeave() {
      blockFocusRef.current = false;
      blockedReferenceRef.current = null;
    },
    onFocus(event) {
      const focusTarget = event.currentTarget;
      if (blockFocusRef.current) {
        if (blockedReferenceRef.current === focusTarget) {
          return;
        }
        blockFocusRef.current = false;
        blockedReferenceRef.current = null;
      }
      const target = getTarget(event.nativeEvent);
      if (visibleOnly && isElement(target)) {
        if (isMacSafari && !event.relatedTarget) {
          if (!keyboardModalityRef.current && !isTypeableElement(target)) {
            return;
          }
        } else if (!matchesFocusVisible(target)) {
          return;
        }
      }
      const movedFromOtherTrigger = event.relatedTarget && store.context.triggerElements.hasElement(event.relatedTarget);
      const {
        nativeEvent,
        currentTarget
      } = event;
      const delayValue = typeof delay === "function" ? delay() : delay;
      if (store.select("open") && movedFromOtherTrigger || delayValue === 0 || delayValue === void 0) {
        store.setOpen(true, createChangeEventDetails(triggerFocus, nativeEvent, currentTarget));
        return;
      }
      timeout.start(delayValue, () => {
        if (blockFocusRef.current) {
          return;
        }
        store.setOpen(true, createChangeEventDetails(triggerFocus, nativeEvent, currentTarget));
      });
    },
    onBlur(event) {
      blockFocusRef.current = false;
      blockedReferenceRef.current = null;
      const relatedTarget = event.relatedTarget;
      const nativeEvent = event.nativeEvent;
      const movedToFocusGuard = isElement(relatedTarget) && relatedTarget.hasAttribute(createAttribute("focus-guard")) && relatedTarget.getAttribute("data-type") === "outside";
      timeout.start(0, () => {
        const domReference = store.select("domReferenceElement");
        const activeEl = activeElement(domReference ? domReference.ownerDocument : document);
        if (!relatedTarget && activeEl === domReference) {
          return;
        }
        if (contains(dataRef.current.floatingContext?.refs.floating.current, activeEl) || contains(domReference, activeEl) || movedToFocusGuard) {
          return;
        }
        const nextFocusedElement = relatedTarget ?? activeEl;
        if (isElement(nextFocusedElement)) {
          const triggerElements = store.context.triggerElements;
          if (triggerElements.hasElement(nextFocusedElement) || triggerElements.hasMatchingElement((trigger) => contains(trigger, nextFocusedElement))) {
            return;
          }
        }
        store.setOpen(false, createChangeEventDetails(triggerFocus, nativeEvent));
      });
    }
  }), [dataRef, store, visibleOnly, timeout, delay]);
  return reactExports.useMemo(() => enabled ? {
    reference,
    trigger: reference
  } : {}, [enabled, reference]);
}
const safePolygonIdentifier = createAttribute("safe-polygon");
const interactiveSelector = `button,a,[role="button"],select,[tabindex]:not([tabindex="-1"]),${TYPEABLE_SELECTOR}`;
function isInteractiveElement(element) {
  return element ? Boolean(element.closest(interactiveSelector)) : false;
}
function useHoverInteractionSharedState(store) {
  const pointerTypeRef = reactExports.useRef(void 0);
  const interactedInsideRef = reactExports.useRef(false);
  const handlerRef = reactExports.useRef(void 0);
  const blockMouseMoveRef = reactExports.useRef(true);
  const performedPointerEventsMutationRef = reactExports.useRef(false);
  const unbindMouseMoveRef = reactExports.useRef(() => {
  });
  const restTimeoutPendingRef = reactExports.useRef(false);
  const openChangeTimeout = useTimeout();
  const restTimeout = useTimeout();
  const handleCloseOptionsRef = reactExports.useRef(void 0);
  return reactExports.useMemo(() => {
    const data = store.context.dataRef.current;
    if (!data.hoverInteractionState) {
      data.hoverInteractionState = {
        pointerTypeRef,
        interactedInsideRef,
        handlerRef,
        blockMouseMoveRef,
        performedPointerEventsMutationRef,
        unbindMouseMoveRef,
        restTimeoutPendingRef,
        openChangeTimeout,
        restTimeout,
        handleCloseOptionsRef
      };
    }
    return data.hoverInteractionState;
  }, [store, pointerTypeRef, interactedInsideRef, handlerRef, blockMouseMoveRef, performedPointerEventsMutationRef, unbindMouseMoveRef, restTimeoutPendingRef, openChangeTimeout, restTimeout, handleCloseOptionsRef]);
}
const clickLikeEvents = /* @__PURE__ */ new Set(["click", "mousedown"]);
function useHoverFloatingInteraction(context, parameters = {}) {
  const store = "rootStore" in context ? context.rootStore : context;
  const open = store.useState("open");
  const floatingElement = store.useState("floatingElement");
  const domReferenceElement = store.useState("domReferenceElement");
  const {
    dataRef
  } = store.context;
  const {
    enabled = true,
    closeDelay: closeDelayProp = 0,
    externalTree
  } = parameters;
  const {
    pointerTypeRef,
    interactedInsideRef,
    handlerRef,
    performedPointerEventsMutationRef,
    unbindMouseMoveRef,
    restTimeoutPendingRef,
    openChangeTimeout,
    handleCloseOptionsRef
  } = useHoverInteractionSharedState(store);
  const tree = useFloatingTree(externalTree);
  const parentId = useFloatingParentNodeId();
  const isClickLikeOpenEvent = useStableCallback(() => {
    if (interactedInsideRef.current) {
      return true;
    }
    return dataRef.current.openEvent ? clickLikeEvents.has(dataRef.current.openEvent.type) : false;
  });
  const isHoverOpen = useStableCallback(() => {
    const type = dataRef.current.openEvent?.type;
    return type?.includes("mouse") && type !== "mousedown";
  });
  const closeWithDelay = reactExports.useCallback((event, runElseBranch = true) => {
    const closeDelay = getDelay(closeDelayProp, pointerTypeRef.current);
    if (closeDelay && !handlerRef.current) {
      openChangeTimeout.start(closeDelay, () => store.setOpen(false, createChangeEventDetails(triggerHover, event)));
    } else if (runElseBranch) {
      openChangeTimeout.clear();
      store.setOpen(false, createChangeEventDetails(triggerHover, event));
    }
  }, [closeDelayProp, handlerRef, store, pointerTypeRef, openChangeTimeout]);
  const cleanupMouseMoveHandler = useStableCallback(() => {
    unbindMouseMoveRef.current();
    handlerRef.current = void 0;
  });
  const clearPointerEvents = useStableCallback(() => {
    if (performedPointerEventsMutationRef.current) {
      const body = getDocument(floatingElement).body;
      body.style.pointerEvents = "";
      body.removeAttribute(safePolygonIdentifier);
      performedPointerEventsMutationRef.current = false;
    }
  });
  const handleInteractInside = useStableCallback((event) => {
    const target = getTarget(event);
    if (!isInteractiveElement(target)) {
      interactedInsideRef.current = false;
      return;
    }
    interactedInsideRef.current = true;
  });
  useIsoLayoutEffect(() => {
    if (!open) {
      pointerTypeRef.current = void 0;
      restTimeoutPendingRef.current = false;
      interactedInsideRef.current = false;
      cleanupMouseMoveHandler();
      clearPointerEvents();
    }
  }, [open, pointerTypeRef, restTimeoutPendingRef, interactedInsideRef, cleanupMouseMoveHandler, clearPointerEvents]);
  reactExports.useEffect(() => {
    return () => {
      cleanupMouseMoveHandler();
    };
  }, [cleanupMouseMoveHandler]);
  reactExports.useEffect(() => {
    return clearPointerEvents;
  }, [clearPointerEvents]);
  useIsoLayoutEffect(() => {
    if (!enabled) {
      return void 0;
    }
    if (open && handleCloseOptionsRef.current?.blockPointerEvents && isHoverOpen() && isElement(domReferenceElement) && floatingElement) {
      performedPointerEventsMutationRef.current = true;
      const body = getDocument(floatingElement).body;
      body.setAttribute(safePolygonIdentifier, "");
      const ref = domReferenceElement;
      const floatingEl = floatingElement;
      const parentFloating = tree?.nodesRef.current.find((node) => node.id === parentId)?.context?.elements.floating;
      if (parentFloating) {
        parentFloating.style.pointerEvents = "";
      }
      body.style.pointerEvents = "none";
      ref.style.pointerEvents = "auto";
      floatingEl.style.pointerEvents = "auto";
      return () => {
        body.style.pointerEvents = "";
        ref.style.pointerEvents = "";
        floatingEl.style.pointerEvents = "";
      };
    }
    return void 0;
  }, [enabled, open, domReferenceElement, floatingElement, handleCloseOptionsRef, isHoverOpen, tree, parentId, performedPointerEventsMutationRef]);
  reactExports.useEffect(() => {
    if (!enabled) {
      return void 0;
    }
    function onScrollMouseLeave(event) {
      if (isClickLikeOpenEvent() || !dataRef.current.floatingContext || !store.select("open")) {
        return;
      }
      const triggerElements = store.context.triggerElements;
      if (event.relatedTarget && triggerElements.hasElement(event.relatedTarget)) {
        return;
      }
      clearPointerEvents();
      cleanupMouseMoveHandler();
      if (!isClickLikeOpenEvent()) {
        closeWithDelay(event);
      }
    }
    function onFloatingMouseEnter(event) {
      openChangeTimeout.clear();
      clearPointerEvents();
      handlerRef.current?.(event);
      cleanupMouseMoveHandler();
    }
    function onFloatingMouseLeave(event) {
      if (!isClickLikeOpenEvent()) {
        closeWithDelay(event, false);
      }
    }
    const floating = floatingElement;
    if (floating) {
      floating.addEventListener("mouseleave", onScrollMouseLeave);
      floating.addEventListener("mouseenter", onFloatingMouseEnter);
      floating.addEventListener("mouseleave", onFloatingMouseLeave);
      floating.addEventListener("pointerdown", handleInteractInside, true);
    }
    return () => {
      if (floating) {
        floating.removeEventListener("mouseleave", onScrollMouseLeave);
        floating.removeEventListener("mouseenter", onFloatingMouseEnter);
        floating.removeEventListener("mouseleave", onFloatingMouseLeave);
        floating.removeEventListener("pointerdown", handleInteractInside, true);
      }
    };
  });
}
function getDelay(value, pointerType) {
  if (pointerType && !isMouseLikePointerType(pointerType)) {
    return 0;
  }
  if (typeof value === "function") {
    return value();
  }
  return value;
}
function getRestMs(value) {
  if (typeof value === "function") {
    return value();
  }
  return value;
}
const EMPTY_REF = {
  current: null
};
function useHoverReferenceInteraction(context, props = {}) {
  const store = "rootStore" in context ? context.rootStore : context;
  const {
    dataRef,
    events
  } = store.context;
  const {
    enabled = true,
    delay = 0,
    handleClose = null,
    mouseOnly = false,
    restMs = 0,
    move = true,
    triggerElementRef = EMPTY_REF,
    externalTree,
    isActiveTrigger = true
  } = props;
  const tree = useFloatingTree(externalTree);
  const {
    pointerTypeRef,
    interactedInsideRef,
    handlerRef: closeHandlerRef,
    blockMouseMoveRef,
    performedPointerEventsMutationRef,
    unbindMouseMoveRef,
    restTimeoutPendingRef,
    openChangeTimeout,
    restTimeout,
    handleCloseOptionsRef
  } = useHoverInteractionSharedState(store);
  const handleCloseRef = useValueAsRef(handleClose);
  const delayRef = useValueAsRef(delay);
  const restMsRef = useValueAsRef(restMs);
  if (isActiveTrigger) {
    handleCloseOptionsRef.current = handleCloseRef.current?.__options;
  }
  const isClickLikeOpenEvent = useStableCallback(() => {
    if (interactedInsideRef.current) {
      return true;
    }
    return dataRef.current.openEvent ? ["click", "mousedown"].includes(dataRef.current.openEvent.type) : false;
  });
  const closeWithDelay = reactExports.useCallback((event, runElseBranch = true) => {
    const closeDelay = getDelay$1(delayRef.current, "close", pointerTypeRef.current);
    if (closeDelay && !closeHandlerRef.current) {
      openChangeTimeout.start(closeDelay, () => store.setOpen(false, createChangeEventDetails(triggerHover, event)));
    } else if (runElseBranch) {
      openChangeTimeout.clear();
      store.setOpen(false, createChangeEventDetails(triggerHover, event));
    }
  }, [delayRef, closeHandlerRef, store, pointerTypeRef, openChangeTimeout]);
  const cleanupMouseMoveHandler = useStableCallback(() => {
    unbindMouseMoveRef.current();
    closeHandlerRef.current = void 0;
  });
  const clearPointerEvents = useStableCallback(() => {
    if (performedPointerEventsMutationRef.current) {
      const body = getDocument(store.select("domReferenceElement")).body;
      body.style.pointerEvents = "";
      body.removeAttribute(safePolygonIdentifier);
      performedPointerEventsMutationRef.current = false;
    }
  });
  reactExports.useEffect(() => {
    if (!enabled) {
      return void 0;
    }
    function onOpenChangeLocal(details) {
      if (!details.open) {
        openChangeTimeout.clear();
        restTimeout.clear();
        blockMouseMoveRef.current = true;
        restTimeoutPendingRef.current = false;
      }
    }
    events.on("openchange", onOpenChangeLocal);
    return () => {
      events.off("openchange", onOpenChangeLocal);
    };
  }, [enabled, events, openChangeTimeout, restTimeout, blockMouseMoveRef, restTimeoutPendingRef]);
  const handleScrollMouseLeave = useStableCallback((event) => {
    if (isClickLikeOpenEvent()) {
      return;
    }
    if (!dataRef.current.floatingContext) {
      return;
    }
    const triggerElements = store.context.triggerElements;
    if (event.relatedTarget && triggerElements.hasElement(event.relatedTarget)) {
      return;
    }
    const currentTrigger = triggerElementRef.current;
    handleCloseRef.current?.({
      ...dataRef.current.floatingContext,
      tree,
      x: event.clientX,
      y: event.clientY,
      onClose() {
        clearPointerEvents();
        cleanupMouseMoveHandler();
        if (!isClickLikeOpenEvent() && currentTrigger === store.select("domReferenceElement")) {
          closeWithDelay(event);
        }
      }
    })(event);
  });
  reactExports.useEffect(() => {
    if (!enabled) {
      return void 0;
    }
    const trigger = triggerElementRef.current ?? (isActiveTrigger ? store.select("domReferenceElement") : null);
    if (!isElement(trigger)) {
      return void 0;
    }
    function onMouseEnter(event) {
      openChangeTimeout.clear();
      blockMouseMoveRef.current = false;
      if (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current)) {
        return;
      }
      if (getRestMs(restMsRef.current) > 0 && !getDelay$1(delayRef.current, "open")) {
        return;
      }
      const openDelay = getDelay$1(delayRef.current, "open", pointerTypeRef.current);
      const currentDomReference = store.select("domReferenceElement");
      const allTriggers = store.context.triggerElements;
      const isOverInactiveTrigger = (allTriggers.hasElement(event.target) || allTriggers.hasMatchingElement((t) => contains(t, event.target))) && (!currentDomReference || !contains(currentDomReference, event.target));
      const triggerNode = event.currentTarget ?? null;
      const isOpen = store.select("open");
      const shouldOpen = !isOpen || isOverInactiveTrigger;
      if (isOverInactiveTrigger && isOpen) {
        store.setOpen(true, createChangeEventDetails(triggerHover, event, triggerNode));
      } else if (openDelay) {
        openChangeTimeout.start(openDelay, () => {
          if (shouldOpen) {
            store.setOpen(true, createChangeEventDetails(triggerHover, event, triggerNode));
          }
        });
      } else if (shouldOpen) {
        store.setOpen(true, createChangeEventDetails(triggerHover, event, triggerNode));
      }
    }
    function onMouseLeave(event) {
      if (isClickLikeOpenEvent()) {
        clearPointerEvents();
        return;
      }
      unbindMouseMoveRef.current();
      const domReferenceElement = store.select("domReferenceElement");
      const doc = getDocument(domReferenceElement);
      restTimeout.clear();
      restTimeoutPendingRef.current = false;
      const triggerElements = store.context.triggerElements;
      if (event.relatedTarget && triggerElements.hasElement(event.relatedTarget)) {
        return;
      }
      if (handleCloseRef.current && dataRef.current.floatingContext) {
        if (!store.select("open")) {
          openChangeTimeout.clear();
        }
        const currentTrigger = triggerElementRef.current;
        closeHandlerRef.current = handleCloseRef.current({
          ...dataRef.current.floatingContext,
          tree,
          x: event.clientX,
          y: event.clientY,
          onClose() {
            clearPointerEvents();
            cleanupMouseMoveHandler();
            if (!isClickLikeOpenEvent() && currentTrigger === store.select("domReferenceElement")) {
              closeWithDelay(event, true);
            }
          }
        });
        const handler = closeHandlerRef.current;
        handler(event);
        doc.addEventListener("mousemove", handler);
        unbindMouseMoveRef.current = () => {
          doc.removeEventListener("mousemove", handler);
        };
        return;
      }
      const shouldClose = pointerTypeRef.current === "touch" ? !contains(store.select("floatingElement"), event.relatedTarget) : true;
      if (shouldClose) {
        closeWithDelay(event);
      }
    }
    function onScrollMouseLeave(event) {
      handleScrollMouseLeave(event);
    }
    if (store.select("open")) {
      trigger.addEventListener("mouseleave", onScrollMouseLeave);
    }
    if (move) {
      trigger.addEventListener("mousemove", onMouseEnter, {
        once: true
      });
    }
    trigger.addEventListener("mouseenter", onMouseEnter);
    trigger.addEventListener("mouseleave", onMouseLeave);
    return () => {
      trigger.removeEventListener("mouseleave", onScrollMouseLeave);
      if (move) {
        trigger.removeEventListener("mousemove", onMouseEnter);
      }
      trigger.removeEventListener("mouseenter", onMouseEnter);
      trigger.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [cleanupMouseMoveHandler, clearPointerEvents, blockMouseMoveRef, dataRef, delayRef, closeWithDelay, store, enabled, handleCloseRef, handleScrollMouseLeave, isActiveTrigger, isClickLikeOpenEvent, mouseOnly, move, pointerTypeRef, restMsRef, restTimeout, restTimeoutPendingRef, openChangeTimeout, triggerElementRef, tree, unbindMouseMoveRef, closeHandlerRef]);
  return reactExports.useMemo(() => {
    function setPointerRef(event) {
      pointerTypeRef.current = event.pointerType;
    }
    return {
      onPointerDown: setPointerRef,
      onPointerEnter: setPointerRef,
      onMouseMove(event) {
        const {
          nativeEvent
        } = event;
        const trigger = event.currentTarget;
        const currentDomReference = store.select("domReferenceElement");
        const allTriggers = store.context.triggerElements;
        const currentOpen = store.select("open");
        const isOverInactiveTrigger = (allTriggers.hasElement(event.target) || allTriggers.hasMatchingElement((t) => contains(t, event.target))) && (!currentDomReference || !contains(currentDomReference, event.target));
        if (mouseOnly && !isMouseLikePointerType(pointerTypeRef.current)) {
          return;
        }
        if (currentOpen && !isOverInactiveTrigger || getRestMs(restMsRef.current) === 0) {
          return;
        }
        if (!isOverInactiveTrigger && restTimeoutPendingRef.current && event.movementX ** 2 + event.movementY ** 2 < 2) {
          return;
        }
        restTimeout.clear();
        function handleMouseMove() {
          restTimeoutPendingRef.current = false;
          if (isClickLikeOpenEvent()) {
            return;
          }
          const latestOpen = store.select("open");
          if (!blockMouseMoveRef.current && (!latestOpen || isOverInactiveTrigger)) {
            store.setOpen(true, createChangeEventDetails(triggerHover, nativeEvent, trigger));
          }
        }
        if (pointerTypeRef.current === "touch") {
          reactDomExports.flushSync(() => {
            handleMouseMove();
          });
        } else if (isOverInactiveTrigger && currentOpen) {
          handleMouseMove();
        } else {
          restTimeoutPendingRef.current = true;
          restTimeout.start(getRestMs(restMsRef.current), handleMouseMove);
        }
      }
    };
  }, [blockMouseMoveRef, isClickLikeOpenEvent, mouseOnly, store, pointerTypeRef, restMsRef, restTimeout, restTimeoutPendingRef]);
}
function useInteractions(propsList = []) {
  const referenceDeps = propsList.map((key) => key?.reference);
  const floatingDeps = propsList.map((key) => key?.floating);
  const itemDeps = propsList.map((key) => key?.item);
  const triggerDeps = propsList.map((key) => key?.trigger);
  const getReferenceProps = reactExports.useCallback(
    (userProps) => mergeProps(userProps, propsList, "reference"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    referenceDeps
  );
  const getFloatingProps = reactExports.useCallback(
    (userProps) => mergeProps(userProps, propsList, "floating"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    floatingDeps
  );
  const getItemProps = reactExports.useCallback(
    (userProps) => mergeProps(userProps, propsList, "item"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    itemDeps
  );
  const getTriggerProps = reactExports.useCallback(
    (userProps) => mergeProps(userProps, propsList, "trigger"),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    triggerDeps
  );
  return reactExports.useMemo(() => ({
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    getTriggerProps
  }), [getReferenceProps, getFloatingProps, getItemProps, getTriggerProps]);
}
function mergeProps(userProps, propsList, elementKey) {
  const eventHandlers = /* @__PURE__ */ new Map();
  const isItem = elementKey === "item";
  const outputProps = {};
  if (elementKey === "floating") {
    outputProps.tabIndex = -1;
    outputProps[FOCUSABLE_ATTRIBUTE] = "";
  }
  for (const key in userProps) {
    if (isItem && userProps) {
      if (key === ACTIVE_KEY || key === SELECTED_KEY) {
        continue;
      }
    }
    outputProps[key] = userProps[key];
  }
  for (let i = 0; i < propsList.length; i += 1) {
    let props;
    const propsOrGetProps = propsList[i]?.[elementKey];
    if (typeof propsOrGetProps === "function") {
      props = userProps ? propsOrGetProps(userProps) : null;
    } else {
      props = propsOrGetProps;
    }
    if (!props) {
      continue;
    }
    mutablyMergeProps(outputProps, props, isItem, eventHandlers);
  }
  mutablyMergeProps(outputProps, userProps, isItem, eventHandlers);
  return outputProps;
}
function mutablyMergeProps(outputProps, props, isItem, eventHandlers) {
  for (const key in props) {
    const value = props[key];
    if (isItem && (key === ACTIVE_KEY || key === SELECTED_KEY)) {
      continue;
    }
    if (!key.startsWith("on")) {
      outputProps[key] = value;
    } else {
      if (!eventHandlers.has(key)) {
        eventHandlers.set(key, []);
      }
      if (typeof value === "function") {
        eventHandlers.get(key)?.push(value);
        outputProps[key] = (...args) => {
          return eventHandlers.get(key)?.map((fn) => fn(...args)).find((val) => val !== void 0);
        };
      }
    }
  }
}
const ESCAPE = "Escape";
function doSwitch(orientation, vertical, horizontal) {
  switch (orientation) {
    case "vertical":
      return vertical;
    case "horizontal":
      return horizontal;
    default:
      return vertical || horizontal;
  }
}
function isMainOrientationKey(key, orientation) {
  const vertical = key === ARROW_UP$1 || key === ARROW_DOWN$1;
  const horizontal = key === ARROW_LEFT$1 || key === ARROW_RIGHT$1;
  return doSwitch(orientation, vertical, horizontal);
}
function isMainOrientationToEndKey(key, orientation, rtl) {
  const vertical = key === ARROW_DOWN$1;
  const horizontal = rtl ? key === ARROW_LEFT$1 : key === ARROW_RIGHT$1;
  return doSwitch(orientation, vertical, horizontal) || key === "Enter" || key === " " || key === "";
}
function isCrossOrientationOpenKey(key, orientation, rtl) {
  const vertical = rtl ? key === ARROW_LEFT$1 : key === ARROW_RIGHT$1;
  const horizontal = key === ARROW_DOWN$1;
  return doSwitch(orientation, vertical, horizontal);
}
function isCrossOrientationCloseKey(key, orientation, rtl, cols) {
  const vertical = rtl ? key === ARROW_RIGHT$1 : key === ARROW_LEFT$1;
  const horizontal = key === ARROW_UP$1;
  if (orientation === "both" || orientation === "horizontal" && cols && cols > 1) {
    return key === ESCAPE;
  }
  return doSwitch(orientation, vertical, horizontal);
}
function useListNavigation(context, props) {
  const store = "rootStore" in context ? context.rootStore : context;
  const open = store.useState("open");
  const floatingElement = store.useState("floatingElement");
  const domReferenceElement = store.useState("domReferenceElement");
  const dataRef = store.context.dataRef;
  const {
    listRef,
    activeIndex,
    onNavigate: onNavigateProp = () => {
    },
    enabled = true,
    selectedIndex = null,
    allowEscape = false,
    loopFocus = false,
    nested = false,
    rtl = false,
    virtual = false,
    focusItemOnOpen = "auto",
    focusItemOnHover = true,
    openOnArrowKeyDown = true,
    disabledIndices = void 0,
    orientation = "vertical",
    parentOrientation,
    cols = 1,
    scrollItemIntoView = true,
    itemSizes,
    dense = false,
    id,
    resetOnPointerLeave = true,
    externalTree
  } = props;
  const floatingFocusElement = getFloatingFocusElement(floatingElement);
  const floatingFocusElementRef = useValueAsRef(floatingFocusElement);
  const parentId = useFloatingParentNodeId();
  const tree = useFloatingTree(externalTree);
  useIsoLayoutEffect(() => {
    dataRef.current.orientation = orientation;
  }, [dataRef, orientation]);
  const typeableComboboxReference = isTypeableCombobox(domReferenceElement);
  const focusItemOnOpenRef = reactExports.useRef(focusItemOnOpen);
  const indexRef = reactExports.useRef(selectedIndex ?? -1);
  const keyRef = reactExports.useRef(null);
  const isPointerModalityRef = reactExports.useRef(true);
  const onNavigate = useStableCallback((event) => {
    onNavigateProp(indexRef.current === -1 ? null : indexRef.current, event);
  });
  const previousOnNavigateRef = reactExports.useRef(onNavigate);
  const previousMountedRef = reactExports.useRef(!!floatingElement);
  const previousOpenRef = reactExports.useRef(open);
  const forceSyncFocusRef = reactExports.useRef(false);
  const forceScrollIntoViewRef = reactExports.useRef(false);
  const disabledIndicesRef = useValueAsRef(disabledIndices);
  const latestOpenRef = useValueAsRef(open);
  const scrollItemIntoViewRef = useValueAsRef(scrollItemIntoView);
  const selectedIndexRef = useValueAsRef(selectedIndex);
  const resetOnPointerLeaveRef = useValueAsRef(resetOnPointerLeave);
  const focusItem = useStableCallback(() => {
    function runFocus(item2) {
      if (virtual) {
        tree?.events.emit("virtualfocus", item2);
      } else {
        enqueueFocus(item2, {
          sync: forceSyncFocusRef.current,
          preventScroll: true
        });
      }
    }
    const initialItem = listRef.current[indexRef.current];
    const forceScrollIntoView = forceScrollIntoViewRef.current;
    if (initialItem) {
      runFocus(initialItem);
    }
    const scheduler = forceSyncFocusRef.current ? (v) => v() : requestAnimationFrame;
    scheduler(() => {
      const waitedItem = listRef.current[indexRef.current] || initialItem;
      if (!waitedItem) {
        return;
      }
      if (!initialItem) {
        runFocus(waitedItem);
      }
      const scrollIntoViewOptions = scrollItemIntoViewRef.current;
      const shouldScrollIntoView = scrollIntoViewOptions && // eslint-disable-next-line @typescript-eslint/no-use-before-define
      item && (forceScrollIntoView || !isPointerModalityRef.current);
      if (shouldScrollIntoView) {
        waitedItem.scrollIntoView?.(typeof scrollIntoViewOptions === "boolean" ? {
          block: "nearest",
          inline: "nearest"
        } : scrollIntoViewOptions);
      }
    });
  });
  useIsoLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    if (open && floatingElement) {
      indexRef.current = selectedIndex ?? -1;
      if (focusItemOnOpenRef.current && selectedIndex != null) {
        forceScrollIntoViewRef.current = true;
        onNavigate();
      }
    } else if (previousMountedRef.current) {
      indexRef.current = -1;
      previousOnNavigateRef.current();
    }
  }, [enabled, open, floatingElement, selectedIndex, onNavigate]);
  useIsoLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    if (!open) {
      forceSyncFocusRef.current = false;
      return;
    }
    if (!floatingElement) {
      return;
    }
    if (activeIndex == null) {
      forceSyncFocusRef.current = false;
      if (selectedIndexRef.current != null) {
        return;
      }
      if (previousMountedRef.current) {
        indexRef.current = -1;
        focusItem();
      }
      if ((!previousOpenRef.current || !previousMountedRef.current) && focusItemOnOpenRef.current && (keyRef.current != null || focusItemOnOpenRef.current === true && keyRef.current == null)) {
        let runs = 0;
        const waitForListPopulated = () => {
          if (listRef.current[0] == null) {
            if (runs < 2) {
              const scheduler = runs ? requestAnimationFrame : queueMicrotask;
              scheduler(waitForListPopulated);
            }
            runs += 1;
          } else {
            indexRef.current = keyRef.current == null || isMainOrientationToEndKey(keyRef.current, orientation, rtl) || nested ? getMinListIndex(listRef) : getMaxListIndex(listRef);
            keyRef.current = null;
            onNavigate();
          }
        };
        waitForListPopulated();
      }
    } else if (!isIndexOutOfListBounds(listRef, activeIndex)) {
      indexRef.current = activeIndex;
      focusItem();
      forceScrollIntoViewRef.current = false;
    }
  }, [enabled, open, floatingElement, activeIndex, selectedIndexRef, nested, listRef, orientation, rtl, onNavigate, focusItem, disabledIndicesRef]);
  useIsoLayoutEffect(() => {
    if (!enabled || floatingElement || !tree || virtual || !previousMountedRef.current) {
      return;
    }
    const nodes = tree.nodesRef.current;
    const parent = nodes.find((node) => node.id === parentId)?.context?.elements.floating;
    const activeEl = activeElement(getDocument(floatingElement));
    const treeContainsActiveEl = nodes.some((node) => node.context && contains(node.context.elements.floating, activeEl));
    if (parent && !treeContainsActiveEl && isPointerModalityRef.current) {
      parent.focus({
        preventScroll: true
      });
    }
  }, [enabled, floatingElement, tree, parentId, virtual]);
  useIsoLayoutEffect(() => {
    previousOnNavigateRef.current = onNavigate;
    previousOpenRef.current = open;
    previousMountedRef.current = !!floatingElement;
  });
  useIsoLayoutEffect(() => {
    if (!open) {
      keyRef.current = null;
      focusItemOnOpenRef.current = focusItemOnOpen;
    }
  }, [open, focusItemOnOpen]);
  const hasActiveIndex = activeIndex != null;
  const item = reactExports.useMemo(() => {
    function syncCurrentTarget(event) {
      if (!latestOpenRef.current) {
        return;
      }
      const index = listRef.current.indexOf(event.currentTarget);
      if (index !== -1 && indexRef.current !== index) {
        indexRef.current = index;
        onNavigate(event);
      }
    }
    const itemProps = {
      onFocus(event) {
        forceSyncFocusRef.current = true;
        syncCurrentTarget(event);
      },
      onClick: ({
        currentTarget
      }) => currentTarget.focus({
        preventScroll: true
      }),
      // Safari
      onMouseMove(event) {
        forceSyncFocusRef.current = true;
        forceScrollIntoViewRef.current = false;
        if (focusItemOnHover) {
          syncCurrentTarget(event);
        }
      },
      onPointerLeave(event) {
        if (!latestOpenRef.current || !isPointerModalityRef.current || event.pointerType === "touch") {
          return;
        }
        forceSyncFocusRef.current = true;
        const relatedTarget = event.relatedTarget;
        if (!focusItemOnHover || listRef.current.includes(relatedTarget)) {
          return;
        }
        if (!resetOnPointerLeaveRef.current) {
          return;
        }
        indexRef.current = -1;
        onNavigate(event);
        if (!virtual) {
          floatingFocusElementRef.current?.focus({
            preventScroll: true
          });
        }
      }
    };
    return itemProps;
  }, [latestOpenRef, floatingFocusElementRef, focusItemOnHover, listRef, onNavigate, resetOnPointerLeaveRef, virtual]);
  const getParentOrientation = reactExports.useCallback(() => {
    return parentOrientation ?? tree?.nodesRef.current.find((node) => node.id === parentId)?.context?.dataRef?.current.orientation;
  }, [parentId, tree, parentOrientation]);
  const commonOnKeyDown = useStableCallback((event) => {
    isPointerModalityRef.current = false;
    forceSyncFocusRef.current = true;
    if (event.which === 229) {
      return;
    }
    if (!latestOpenRef.current && event.currentTarget === floatingFocusElementRef.current) {
      return;
    }
    if (nested && isCrossOrientationCloseKey(event.key, orientation, rtl, cols)) {
      if (!isMainOrientationKey(event.key, getParentOrientation())) {
        stopEvent(event);
      }
      store.setOpen(false, createChangeEventDetails(listNavigation, event.nativeEvent));
      if (isHTMLElement(domReferenceElement)) {
        if (virtual) {
          tree?.events.emit("virtualfocus", domReferenceElement);
        } else {
          domReferenceElement.focus();
        }
      }
      return;
    }
    const currentIndex = indexRef.current;
    const minIndex = getMinListIndex(listRef, disabledIndices);
    const maxIndex = getMaxListIndex(listRef, disabledIndices);
    if (!typeableComboboxReference) {
      if (event.key === "Home") {
        stopEvent(event);
        indexRef.current = minIndex;
        onNavigate(event);
      }
      if (event.key === "End") {
        stopEvent(event);
        indexRef.current = maxIndex;
        onNavigate(event);
      }
    }
    if (cols > 1) {
      const sizes = itemSizes || Array.from({
        length: listRef.current.length
      }, () => ({
        width: 1,
        height: 1
      }));
      const cellMap = createGridCellMap(sizes, cols, dense);
      const minGridIndex = cellMap.findIndex((index2) => index2 != null && !isListIndexDisabled(listRef, index2, disabledIndices));
      const maxGridIndex = cellMap.reduce((foundIndex, index2, cellIndex) => index2 != null && !isListIndexDisabled(listRef, index2, disabledIndices) ? cellIndex : foundIndex, -1);
      const index = cellMap[getGridNavigatedIndex({
        current: cellMap.map((itemIndex) => itemIndex != null ? listRef.current[itemIndex] : null)
      }, {
        event,
        orientation,
        loopFocus,
        rtl,
        cols,
        // treat undefined (empty grid spaces) as disabled indices so we
        // don't end up in them
        disabledIndices: getGridCellIndices([...(typeof disabledIndices !== "function" ? disabledIndices : null) || listRef.current.map((_, listIndex) => isListIndexDisabled(listRef, listIndex, disabledIndices) ? listIndex : void 0), void 0], cellMap),
        minIndex: minGridIndex,
        maxIndex: maxGridIndex,
        prevIndex: getGridCellIndexOfCorner(
          indexRef.current > maxIndex ? minIndex : indexRef.current,
          sizes,
          cellMap,
          cols,
          // use a corner matching the edge closest to the direction
          // we're moving in so we don't end up in the same item. Prefer
          // top/left over bottom/right.
          // eslint-disable-next-line no-nested-ternary
          event.key === ARROW_DOWN$1 ? "bl" : event.key === (rtl ? ARROW_LEFT$1 : ARROW_RIGHT$1) ? "tr" : "tl"
        ),
        stopEvent: true
      })];
      if (index != null) {
        indexRef.current = index;
        onNavigate(event);
      }
      if (orientation === "both") {
        return;
      }
    }
    if (isMainOrientationKey(event.key, orientation)) {
      stopEvent(event);
      if (open && !virtual && activeElement(event.currentTarget.ownerDocument) === event.currentTarget) {
        indexRef.current = isMainOrientationToEndKey(event.key, orientation, rtl) ? minIndex : maxIndex;
        onNavigate(event);
        return;
      }
      if (isMainOrientationToEndKey(event.key, orientation, rtl)) {
        if (loopFocus) {
          if (currentIndex >= maxIndex) {
            if (allowEscape && currentIndex !== listRef.current.length) {
              indexRef.current = -1;
            } else {
              forceSyncFocusRef.current = false;
              indexRef.current = minIndex;
            }
          } else {
            indexRef.current = findNonDisabledListIndex(listRef, {
              startingIndex: currentIndex,
              disabledIndices
            });
          }
        } else {
          indexRef.current = Math.min(maxIndex, findNonDisabledListIndex(listRef, {
            startingIndex: currentIndex,
            disabledIndices
          }));
        }
      } else if (loopFocus) {
        if (currentIndex <= minIndex) {
          if (allowEscape && currentIndex !== -1) {
            indexRef.current = listRef.current.length;
          } else {
            forceSyncFocusRef.current = false;
            indexRef.current = maxIndex;
          }
        } else {
          indexRef.current = findNonDisabledListIndex(listRef, {
            startingIndex: currentIndex,
            decrement: true,
            disabledIndices
          });
        }
      } else {
        indexRef.current = Math.max(minIndex, findNonDisabledListIndex(listRef, {
          startingIndex: currentIndex,
          decrement: true,
          disabledIndices
        }));
      }
      if (isIndexOutOfListBounds(listRef, indexRef.current)) {
        indexRef.current = -1;
      }
      onNavigate(event);
    }
  });
  const ariaActiveDescendantProp = reactExports.useMemo(() => {
    return virtual && open && hasActiveIndex && {
      "aria-activedescendant": `${id}-${activeIndex}`
    };
  }, [virtual, open, hasActiveIndex, id, activeIndex]);
  const floating = reactExports.useMemo(() => {
    return {
      "aria-orientation": orientation === "both" ? void 0 : orientation,
      ...!typeableComboboxReference ? ariaActiveDescendantProp : {},
      onKeyDown(event) {
        if (event.key === "Tab" && event.shiftKey && open && !virtual) {
          const target = getTarget(event.nativeEvent);
          if (target && !contains(floatingFocusElementRef.current, target)) {
            return;
          }
          stopEvent(event);
          store.setOpen(false, createChangeEventDetails(focusOut, event.nativeEvent));
          if (isHTMLElement(domReferenceElement)) {
            domReferenceElement.focus();
          }
          return;
        }
        commonOnKeyDown(event);
      },
      onPointerMove() {
        isPointerModalityRef.current = true;
      }
    };
  }, [ariaActiveDescendantProp, commonOnKeyDown, floatingFocusElementRef, orientation, typeableComboboxReference, store, open, virtual, domReferenceElement]);
  const trigger = reactExports.useMemo(() => {
    function checkVirtualMouse(event) {
      if (focusItemOnOpen === "auto" && isVirtualClick(event.nativeEvent)) {
        focusItemOnOpenRef.current = !virtual;
      }
    }
    function checkVirtualPointer(event) {
      focusItemOnOpenRef.current = focusItemOnOpen;
      if (focusItemOnOpen === "auto" && isVirtualPointerEvent(event.nativeEvent)) {
        focusItemOnOpenRef.current = true;
      }
    }
    return {
      onKeyDown(event) {
        const currentOpen = store.select("open");
        isPointerModalityRef.current = false;
        const isArrowKey = event.key.startsWith("Arrow");
        const isParentCrossOpenKey = isCrossOrientationOpenKey(event.key, getParentOrientation(), rtl);
        const isMainKey = isMainOrientationKey(event.key, orientation);
        const isNavigationKey = (nested ? isParentCrossOpenKey : isMainKey) || event.key === "Enter" || event.key.trim() === "";
        if (virtual && currentOpen) {
          return commonOnKeyDown(event);
        }
        if (!currentOpen && !openOnArrowKeyDown && isArrowKey) {
          return void 0;
        }
        if (isNavigationKey) {
          const isParentMainKey = isMainOrientationKey(event.key, getParentOrientation());
          keyRef.current = nested && isParentMainKey ? null : event.key;
        }
        if (nested) {
          if (isParentCrossOpenKey) {
            stopEvent(event);
            if (currentOpen) {
              indexRef.current = getMinListIndex(listRef, disabledIndicesRef.current);
              onNavigate(event);
            } else {
              store.setOpen(true, createChangeEventDetails(listNavigation, event.nativeEvent, event.currentTarget));
            }
          }
          return void 0;
        }
        if (isMainKey) {
          if (selectedIndexRef.current != null) {
            indexRef.current = selectedIndexRef.current;
          }
          stopEvent(event);
          if (!currentOpen && openOnArrowKeyDown) {
            store.setOpen(true, createChangeEventDetails(listNavigation, event.nativeEvent, event.currentTarget));
          } else {
            commonOnKeyDown(event);
          }
          if (currentOpen) {
            onNavigate(event);
          }
        }
        return void 0;
      },
      onFocus(event) {
        if (store.select("open") && !virtual) {
          indexRef.current = -1;
          onNavigate(event);
        }
      },
      onPointerDown: checkVirtualPointer,
      onPointerEnter: checkVirtualPointer,
      onMouseDown: checkVirtualMouse,
      onClick: checkVirtualMouse
    };
  }, [commonOnKeyDown, disabledIndicesRef, focusItemOnOpen, listRef, nested, onNavigate, store, openOnArrowKeyDown, orientation, getParentOrientation, rtl, selectedIndexRef, virtual]);
  const reference = reactExports.useMemo(() => {
    return {
      ...ariaActiveDescendantProp,
      ...trigger
    };
  }, [ariaActiveDescendantProp, trigger]);
  return reactExports.useMemo(() => enabled ? {
    reference,
    floating,
    item,
    trigger
  } : {}, [enabled, reference, floating, trigger, item]);
}
const componentRoleToAriaRoleMap = /* @__PURE__ */ new Map([["select", "listbox"], ["combobox", "listbox"], ["label", false]]);
function useRole(context, props = {}) {
  const store = "rootStore" in context ? context.rootStore : context;
  const open = store.useState("open");
  const defaultFloatingId = store.useState("floatingId");
  const domReference = store.useState("domReferenceElement");
  const floatingElement = store.useState("floatingElement");
  const {
    enabled = true,
    role = "dialog"
  } = props;
  const defaultReferenceId = useId();
  const referenceId = domReference?.id || defaultReferenceId;
  const floatingId = reactExports.useMemo(() => getFloatingFocusElement(floatingElement)?.id || defaultFloatingId, [floatingElement, defaultFloatingId]);
  const ariaRole = componentRoleToAriaRoleMap.get(role) ?? role;
  const parentId = useFloatingParentNodeId();
  const isNested = parentId != null;
  const trigger = reactExports.useMemo(() => {
    if (ariaRole === "tooltip" || role === "label") {
      return EMPTY_OBJECT;
    }
    return {
      "aria-haspopup": ariaRole === "alertdialog" ? "dialog" : ariaRole,
      "aria-expanded": "false",
      ...ariaRole === "listbox" && {
        role: "combobox"
      },
      ...ariaRole === "menu" && isNested && {
        role: "menuitem"
      },
      ...role === "select" && {
        "aria-autocomplete": "none"
      },
      ...role === "combobox" && {
        "aria-autocomplete": "list"
      }
    };
  }, [ariaRole, isNested, role]);
  const reference = reactExports.useMemo(() => {
    if (ariaRole === "tooltip" || role === "label") {
      return {
        [`aria-${role === "label" ? "labelledby" : "describedby"}`]: open ? floatingId : void 0
      };
    }
    const triggerProps = trigger;
    return {
      ...triggerProps,
      "aria-expanded": open ? "true" : "false",
      "aria-controls": open ? floatingId : void 0,
      ...ariaRole === "menu" && {
        id: referenceId
      }
    };
  }, [ariaRole, floatingId, open, referenceId, role, trigger]);
  const floating = reactExports.useMemo(() => {
    const floatingProps = {
      id: floatingId,
      ...ariaRole && {
        role: ariaRole
      }
    };
    if (ariaRole === "tooltip" || role === "label") {
      return floatingProps;
    }
    return {
      ...floatingProps,
      ...ariaRole === "menu" && {
        "aria-labelledby": referenceId
      }
    };
  }, [ariaRole, floatingId, referenceId, role]);
  const item = reactExports.useCallback(({
    active,
    selected
  }) => {
    const commonProps = {
      role: "option",
      ...active && {
        id: `${floatingId}-fui-option`
      }
    };
    switch (role) {
      case "select":
      case "combobox":
        return {
          ...commonProps,
          "aria-selected": selected
        };
    }
    return {};
  }, [floatingId, role]);
  return reactExports.useMemo(() => enabled ? {
    reference,
    floating,
    item,
    trigger
  } : {}, [enabled, reference, floating, trigger, item]);
}
function useTypeahead(context, props) {
  const store = "rootStore" in context ? context.rootStore : context;
  const open = store.useState("open");
  const dataRef = store.context.dataRef;
  const {
    listRef,
    activeIndex,
    onMatch: onMatchProp,
    onTypingChange,
    enabled = true,
    findMatch = null,
    resetMs = 750,
    ignoreKeys = EMPTY_ARRAY,
    selectedIndex = null
  } = props;
  const timeout = useTimeout();
  const stringRef = reactExports.useRef("");
  const prevIndexRef = reactExports.useRef(selectedIndex ?? activeIndex ?? -1);
  const matchIndexRef = reactExports.useRef(null);
  useIsoLayoutEffect(() => {
    if (open) {
      timeout.clear();
      matchIndexRef.current = null;
      stringRef.current = "";
    }
  }, [open, timeout]);
  useIsoLayoutEffect(() => {
    if (open && stringRef.current === "") {
      prevIndexRef.current = selectedIndex ?? activeIndex ?? -1;
    }
  }, [open, selectedIndex, activeIndex]);
  const setTypingChange = useStableCallback((value) => {
    if (value) {
      if (!dataRef.current.typing) {
        dataRef.current.typing = value;
        onTypingChange?.(value);
      }
    } else if (dataRef.current.typing) {
      dataRef.current.typing = value;
      onTypingChange?.(value);
    }
  });
  const onKeyDown = useStableCallback((event) => {
    function getMatchingIndex(list, orderedList, string) {
      const str = findMatch ? findMatch(orderedList, string) : orderedList.find((text) => text?.toLocaleLowerCase().indexOf(string.toLocaleLowerCase()) === 0);
      return str ? list.indexOf(str) : -1;
    }
    const listContent = listRef.current;
    if (stringRef.current.length > 0 && stringRef.current[0] !== " ") {
      if (getMatchingIndex(listContent, listContent, stringRef.current) === -1) {
        setTypingChange(false);
      } else if (event.key === " ") {
        stopEvent(event);
      }
    }
    if (listContent == null || ignoreKeys.includes(event.key) || // Character key.
    event.key.length !== 1 || // Modifier key.
    event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
    if (open && event.key !== " ") {
      stopEvent(event);
      setTypingChange(true);
    }
    const allowRapidSuccessionOfFirstLetter = listContent.every((text) => text ? text[0]?.toLocaleLowerCase() !== text[1]?.toLocaleLowerCase() : true);
    if (allowRapidSuccessionOfFirstLetter && stringRef.current === event.key) {
      stringRef.current = "";
      prevIndexRef.current = matchIndexRef.current;
    }
    stringRef.current += event.key;
    timeout.start(resetMs, () => {
      stringRef.current = "";
      prevIndexRef.current = matchIndexRef.current;
      setTypingChange(false);
    });
    const prevIndex = prevIndexRef.current;
    const index = getMatchingIndex(listContent, [...listContent.slice((prevIndex || 0) + 1), ...listContent.slice(0, (prevIndex || 0) + 1)], stringRef.current);
    if (index !== -1) {
      onMatchProp?.(index);
      matchIndexRef.current = index;
    } else if (event.key !== " ") {
      stringRef.current = "";
      setTypingChange(false);
    }
  });
  const reference = reactExports.useMemo(() => ({
    onKeyDown
  }), [onKeyDown]);
  const floating = reactExports.useMemo(() => {
    return {
      onKeyDown,
      onKeyUp(event) {
        if (event.key === " ") {
          setTypingChange(false);
        }
      }
    };
  }, [onKeyDown, setTypingChange]);
  return reactExports.useMemo(() => enabled ? {
    reference,
    floating
  } : {}, [enabled, reference, floating]);
}
function isPointInPolygon(point, polygon) {
  const [x, y] = point;
  let isInsideValue = false;
  const length = polygon.length;
  for (let i = 0, j = length - 1; i < length; j = i++) {
    const [xi, yi] = polygon[i] || [0, 0];
    const [xj, yj] = polygon[j] || [0, 0];
    const intersect = yi >= y !== yj >= y && x <= (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) {
      isInsideValue = !isInsideValue;
    }
  }
  return isInsideValue;
}
function isInside(point, rect) {
  return point[0] >= rect.x && point[0] <= rect.x + rect.width && point[1] >= rect.y && point[1] <= rect.y + rect.height;
}
function safePolygon(options = {}) {
  const {
    buffer = 0.5,
    blockPointerEvents = false,
    requireIntent = true
  } = options;
  const timeout = new Timeout();
  let hasLanded = false;
  let lastX = null;
  let lastY = null;
  let lastCursorTime = typeof performance !== "undefined" ? performance.now() : 0;
  function getCursorSpeed(x, y) {
    const currentTime = performance.now();
    const elapsedTime = currentTime - lastCursorTime;
    if (lastX === null || lastY === null || elapsedTime === 0) {
      lastX = x;
      lastY = y;
      lastCursorTime = currentTime;
      return null;
    }
    const deltaX = x - lastX;
    const deltaY = y - lastY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const speed = distance / elapsedTime;
    lastX = x;
    lastY = y;
    lastCursorTime = currentTime;
    return speed;
  }
  const fn = ({
    x,
    y,
    placement,
    elements,
    onClose,
    nodeId,
    tree
  }) => {
    return function onMouseMove(event) {
      function close() {
        timeout.clear();
        onClose();
      }
      timeout.clear();
      if (!elements.domReference || !elements.floating || placement == null || x == null || y == null) {
        return void 0;
      }
      const {
        clientX,
        clientY
      } = event;
      const clientPoint = [clientX, clientY];
      const target = getTarget(event);
      const isLeave = event.type === "mouseleave";
      const isOverFloatingEl = contains(elements.floating, target);
      const isOverReferenceEl = contains(elements.domReference, target);
      const refRect = elements.domReference.getBoundingClientRect();
      const rect = elements.floating.getBoundingClientRect();
      const side = placement.split("-")[0];
      const cursorLeaveFromRight = x > rect.right - rect.width / 2;
      const cursorLeaveFromBottom = y > rect.bottom - rect.height / 2;
      const isOverReferenceRect = isInside(clientPoint, refRect);
      const isFloatingWider = rect.width > refRect.width;
      const isFloatingTaller = rect.height > refRect.height;
      const left = (isFloatingWider ? refRect : rect).left;
      const right = (isFloatingWider ? refRect : rect).right;
      const top = (isFloatingTaller ? refRect : rect).top;
      const bottom = (isFloatingTaller ? refRect : rect).bottom;
      if (isOverFloatingEl) {
        hasLanded = true;
        if (!isLeave) {
          return void 0;
        }
      }
      if (isOverReferenceEl) {
        hasLanded = false;
      }
      if (isOverReferenceEl && !isLeave) {
        hasLanded = true;
        return void 0;
      }
      if (isLeave && isElement(event.relatedTarget) && contains(elements.floating, event.relatedTarget)) {
        return void 0;
      }
      if (tree && getNodeChildren(tree.nodesRef.current, nodeId).some(({
        context
      }) => context?.open)) {
        return void 0;
      }
      if (side === "top" && y >= refRect.bottom - 1 || side === "bottom" && y <= refRect.top + 1 || side === "left" && x >= refRect.right - 1 || side === "right" && x <= refRect.left + 1) {
        return close();
      }
      let rectPoly = [];
      switch (side) {
        case "top":
          rectPoly = [[left, refRect.top + 1], [left, rect.bottom - 1], [right, rect.bottom - 1], [right, refRect.top + 1]];
          break;
        case "bottom":
          rectPoly = [[left, rect.top + 1], [left, refRect.bottom - 1], [right, refRect.bottom - 1], [right, rect.top + 1]];
          break;
        case "left":
          rectPoly = [[rect.right - 1, bottom], [rect.right - 1, top], [refRect.left + 1, top], [refRect.left + 1, bottom]];
          break;
        case "right":
          rectPoly = [[refRect.right - 1, bottom], [refRect.right - 1, top], [rect.left + 1, top], [rect.left + 1, bottom]];
          break;
      }
      function getPolygon([px, py]) {
        switch (side) {
          case "top": {
            const cursorPointOne = [isFloatingWider ? px + buffer / 2 : cursorLeaveFromRight ? px + buffer * 4 : px - buffer * 4, py + buffer + 1];
            const cursorPointTwo = [isFloatingWider ? px - buffer / 2 : cursorLeaveFromRight ? px + buffer * 4 : px - buffer * 4, py + buffer + 1];
            const commonPoints = [[rect.left, cursorLeaveFromRight ? rect.bottom - buffer : isFloatingWider ? rect.bottom - buffer : rect.top], [rect.right, cursorLeaveFromRight ? isFloatingWider ? rect.bottom - buffer : rect.top : rect.bottom - buffer]];
            return [cursorPointOne, cursorPointTwo, ...commonPoints];
          }
          case "bottom": {
            const cursorPointOne = [isFloatingWider ? px + buffer / 2 : cursorLeaveFromRight ? px + buffer * 4 : px - buffer * 4, py - buffer];
            const cursorPointTwo = [isFloatingWider ? px - buffer / 2 : cursorLeaveFromRight ? px + buffer * 4 : px - buffer * 4, py - buffer];
            const commonPoints = [[rect.left, cursorLeaveFromRight ? rect.top + buffer : isFloatingWider ? rect.top + buffer : rect.bottom], [rect.right, cursorLeaveFromRight ? isFloatingWider ? rect.top + buffer : rect.bottom : rect.top + buffer]];
            return [cursorPointOne, cursorPointTwo, ...commonPoints];
          }
          case "left": {
            const cursorPointOne = [px + buffer + 1, isFloatingTaller ? py + buffer / 2 : cursorLeaveFromBottom ? py + buffer * 4 : py - buffer * 4];
            const cursorPointTwo = [px + buffer + 1, isFloatingTaller ? py - buffer / 2 : cursorLeaveFromBottom ? py + buffer * 4 : py - buffer * 4];
            const commonPoints = [[cursorLeaveFromBottom ? rect.right - buffer : isFloatingTaller ? rect.right - buffer : rect.left, rect.top], [cursorLeaveFromBottom ? isFloatingTaller ? rect.right - buffer : rect.left : rect.right - buffer, rect.bottom]];
            return [...commonPoints, cursorPointOne, cursorPointTwo];
          }
          case "right": {
            const cursorPointOne = [px - buffer, isFloatingTaller ? py + buffer / 2 : cursorLeaveFromBottom ? py + buffer * 4 : py - buffer * 4];
            const cursorPointTwo = [px - buffer, isFloatingTaller ? py - buffer / 2 : cursorLeaveFromBottom ? py + buffer * 4 : py - buffer * 4];
            const commonPoints = [[cursorLeaveFromBottom ? rect.left + buffer : isFloatingTaller ? rect.left + buffer : rect.right, rect.top], [cursorLeaveFromBottom ? isFloatingTaller ? rect.left + buffer : rect.right : rect.left + buffer, rect.bottom]];
            return [cursorPointOne, cursorPointTwo, ...commonPoints];
          }
          default:
            return [];
        }
      }
      if (isPointInPolygon([clientX, clientY], rectPoly)) {
        return void 0;
      }
      if (hasLanded && !isOverReferenceRect) {
        return close();
      }
      if (!isLeave && requireIntent) {
        const cursorSpeed = getCursorSpeed(event.clientX, event.clientY);
        const cursorSpeedThreshold = 0.1;
        if (cursorSpeed !== null && cursorSpeed < cursorSpeedThreshold) {
          return close();
        }
      }
      if (!isPointInPolygon([clientX, clientY], getPolygon([x, y]))) {
        close();
      } else if (!hasLanded && requireIntent) {
        timeout.start(40, close);
      }
      return void 0;
    };
  };
  fn.__options = {
    blockPointerEvents
  };
  return fn;
}
const FloatingPortalLite = /* @__PURE__ */ reactExports.forwardRef(function FloatingPortalLite2(componentProps, forwardedRef) {
  const {
    children,
    container,
    className,
    render,
    ...elementProps
  } = componentProps;
  const {
    portalNode,
    portalSubtree
  } = useFloatingPortalNode({
    container,
    ref: forwardedRef,
    componentProps,
    elementProps
  });
  if (!portalSubtree && !portalNode) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, {
    children: [portalSubtree, portalNode && /* @__PURE__ */ reactDomExports.createPortal(children, portalNode)]
  });
});
const ToastPortal = FloatingPortalLite;
const DirectionContext = /* @__PURE__ */ reactExports.createContext(void 0);
function useDirection() {
  const context = reactExports.useContext(DirectionContext);
  return context?.direction ?? "ltr";
}
const baseArrow = (options) => ({
  name: "arrow",
  options,
  async fn(state) {
    const {
      x,
      y,
      placement,
      rects,
      platform,
      elements,
      middlewareData
    } = state;
    const {
      element,
      padding = 0,
      offsetParent = "real"
    } = evaluate(options, state) || {};
    if (element == null) {
      return {};
    }
    const paddingObject = getPaddingObject(padding);
    const coords = {
      x,
      y
    };
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === "y";
    const minProp = isYAxis ? "top" : "left";
    const maxProp = isYAxis ? "bottom" : "right";
    const clientProp = isYAxis ? "clientHeight" : "clientWidth";
    const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];
    const arrowOffsetParent = offsetParent === "real" ? await platform.getOffsetParent?.(element) : elements.floating;
    let clientSize = elements.floating[clientProp] || rects.floating[length];
    if (!clientSize || !await platform.isElement?.(arrowOffsetParent)) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }
    const centerToReference = endDiff / 2 - startDiff / 2;
    const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = Math.min(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = Math.min(paddingObject[maxProp], largestPossiblePadding);
    const min = minPadding;
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset2 = clamp(min, center, max);
    const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
    const alignmentOffset = shouldAddOffset ? center < min ? center - min : center - max : 0;
    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset2,
        centerOffset: center - offset2 - alignmentOffset,
        ...shouldAddOffset && {
          alignmentOffset
        }
      },
      reset: shouldAddOffset
    };
  }
});
const arrow = (options, deps) => ({
  ...baseArrow(options),
  options: [options, deps]
});
const hide = {
  name: "hide",
  async fn(state) {
    const {
      width,
      height,
      x,
      y
    } = state.rects.reference;
    const anchorHidden = width === 0 && height === 0 && x === 0 && y === 0;
    const nativeHideResult = await hide$1().fn(state);
    return {
      data: {
        referenceHidden: nativeHideResult.data?.referenceHidden || anchorHidden
      }
    };
  }
};
const DEFAULT_SIDES = {
  sideX: "left",
  sideY: "top"
};
const adaptiveOrigin = {
  name: "adaptiveOrigin",
  async fn(state) {
    const {
      x: rawX,
      y: rawY,
      rects: {
        floating: floatRect
      },
      elements: {
        floating
      },
      platform,
      strategy,
      placement
    } = state;
    const win = getWindow(floating);
    const styles = win.getComputedStyle(floating);
    const hasTransition = styles.transitionDuration !== "0s" && styles.transitionDuration !== "";
    if (!hasTransition) {
      return {
        x: rawX,
        y: rawY,
        data: DEFAULT_SIDES
      };
    }
    const offsetParent = await platform.getOffsetParent?.(floating);
    let offsetDimensions = {
      width: 0,
      height: 0
    };
    if (strategy === "fixed" && win?.visualViewport) {
      offsetDimensions = {
        width: win.visualViewport.width,
        height: win.visualViewport.height
      };
    } else if (offsetParent === win) {
      const doc = ownerDocument(floating);
      offsetDimensions = {
        width: doc.documentElement.clientWidth,
        height: doc.documentElement.clientHeight
      };
    } else if (await platform.isElement?.(offsetParent)) {
      offsetDimensions = await platform.getDimensions(offsetParent);
    }
    const currentSide = getSide(placement);
    let x = rawX;
    let y = rawY;
    if (currentSide === "left") {
      x = offsetDimensions.width - (rawX + floatRect.width);
    }
    if (currentSide === "top") {
      y = offsetDimensions.height - (rawY + floatRect.height);
    }
    const sideX = currentSide === "left" ? "right" : DEFAULT_SIDES.sideX;
    const sideY = currentSide === "top" ? "bottom" : DEFAULT_SIDES.sideY;
    return {
      x,
      y,
      data: {
        sideX,
        sideY
      }
    };
  }
};
function getLogicalSide(sideParam, renderedSide, isRtl) {
  const isLogicalSideParam = sideParam === "inline-start" || sideParam === "inline-end";
  const logicalRight = isRtl ? "inline-start" : "inline-end";
  const logicalLeft = isRtl ? "inline-end" : "inline-start";
  return {
    top: "top",
    right: isLogicalSideParam ? logicalRight : "right",
    bottom: "bottom",
    left: isLogicalSideParam ? logicalLeft : "left"
  }[renderedSide];
}
function getOffsetData(state, sideParam, isRtl) {
  const {
    rects,
    placement
  } = state;
  const data = {
    side: getLogicalSide(sideParam, getSide(placement), isRtl),
    align: getAlignment(placement) || "center",
    anchor: {
      width: rects.reference.width,
      height: rects.reference.height
    },
    positioner: {
      width: rects.floating.width,
      height: rects.floating.height
    }
  };
  return data;
}
function useAnchorPositioning(params) {
  const {
    // Public parameters
    anchor,
    positionMethod = "absolute",
    side: sideParam = "bottom",
    sideOffset = 0,
    align = "center",
    alignOffset = 0,
    collisionBoundary,
    collisionPadding: collisionPaddingParam = 5,
    sticky = false,
    arrowPadding = 5,
    disableAnchorTracking = false,
    // Private parameters
    keepMounted = false,
    floatingRootContext,
    mounted,
    collisionAvoidance,
    shiftCrossAxis = false,
    nodeId,
    adaptiveOrigin: adaptiveOrigin2,
    lazyFlip = false,
    externalTree
  } = params;
  const [mountSide, setMountSide] = reactExports.useState(null);
  if (!mounted && mountSide !== null) {
    setMountSide(null);
  }
  const collisionAvoidanceSide = collisionAvoidance.side || "flip";
  const collisionAvoidanceAlign = collisionAvoidance.align || "flip";
  const collisionAvoidanceFallbackAxisSide = collisionAvoidance.fallbackAxisSide || "end";
  const anchorFn = typeof anchor === "function" ? anchor : void 0;
  const anchorFnCallback = useStableCallback(anchorFn);
  const anchorDep = anchorFn ? anchorFnCallback : anchor;
  const anchorValueRef = useValueAsRef(anchor);
  const direction = useDirection();
  const isRtl = direction === "rtl";
  const side = mountSide || {
    top: "top",
    right: "right",
    bottom: "bottom",
    left: "left",
    "inline-end": isRtl ? "left" : "right",
    "inline-start": isRtl ? "right" : "left"
  }[sideParam];
  const placement = align === "center" ? side : `${side}-${align}`;
  let collisionPadding = collisionPaddingParam;
  const bias = 1;
  const biasTop = sideParam === "bottom" ? bias : 0;
  const biasBottom = sideParam === "top" ? bias : 0;
  const biasLeft = sideParam === "right" ? bias : 0;
  const biasRight = sideParam === "left" ? bias : 0;
  if (typeof collisionPadding === "number") {
    collisionPadding = {
      top: collisionPadding + biasTop,
      right: collisionPadding + biasRight,
      bottom: collisionPadding + biasBottom,
      left: collisionPadding + biasLeft
    };
  } else if (collisionPadding) {
    collisionPadding = {
      top: (collisionPadding.top || 0) + biasTop,
      right: (collisionPadding.right || 0) + biasRight,
      bottom: (collisionPadding.bottom || 0) + biasBottom,
      left: (collisionPadding.left || 0) + biasLeft
    };
  }
  const commonCollisionProps = {
    boundary: collisionBoundary === "clipping-ancestors" ? "clippingAncestors" : collisionBoundary,
    padding: collisionPadding
  };
  const arrowRef = reactExports.useRef(null);
  const sideOffsetRef = useValueAsRef(sideOffset);
  const alignOffsetRef = useValueAsRef(alignOffset);
  const sideOffsetDep = typeof sideOffset !== "function" ? sideOffset : 0;
  const alignOffsetDep = typeof alignOffset !== "function" ? alignOffset : 0;
  const middleware = [offset((state) => {
    const data = getOffsetData(state, sideParam, isRtl);
    const sideAxis = typeof sideOffsetRef.current === "function" ? sideOffsetRef.current(data) : sideOffsetRef.current;
    const alignAxis = typeof alignOffsetRef.current === "function" ? alignOffsetRef.current(data) : alignOffsetRef.current;
    return {
      mainAxis: sideAxis,
      crossAxis: alignAxis,
      alignmentAxis: alignAxis
    };
  }, [sideOffsetDep, alignOffsetDep, isRtl, sideParam])];
  const shiftDisabled = collisionAvoidanceAlign === "none" && collisionAvoidanceSide !== "shift";
  const crossAxisShiftEnabled = !shiftDisabled && (sticky || shiftCrossAxis || collisionAvoidanceSide === "shift");
  const flipMiddleware = collisionAvoidanceSide === "none" ? null : flip({
    ...commonCollisionProps,
    // Ensure the popup flips if it's been limited by its --available-height and it resizes.
    // Since the size() padding is smaller than the flip() padding, flip() will take precedence.
    padding: {
      top: collisionPadding.top + bias,
      right: collisionPadding.right + bias,
      bottom: collisionPadding.bottom + bias,
      left: collisionPadding.left + bias
    },
    mainAxis: !shiftCrossAxis && collisionAvoidanceSide === "flip",
    crossAxis: collisionAvoidanceAlign === "flip" ? "alignment" : false,
    fallbackAxisSideDirection: collisionAvoidanceFallbackAxisSide
  });
  const shiftMiddleware = shiftDisabled ? null : shift((data) => {
    const html = ownerDocument(data.elements.floating).documentElement;
    return {
      ...commonCollisionProps,
      // Use the Layout Viewport to avoid shifting around when pinch-zooming
      // for context menus.
      rootBoundary: shiftCrossAxis ? {
        x: 0,
        y: 0,
        width: html.clientWidth,
        height: html.clientHeight
      } : void 0,
      mainAxis: collisionAvoidanceAlign !== "none",
      crossAxis: crossAxisShiftEnabled,
      limiter: sticky || shiftCrossAxis ? void 0 : limitShift((limitData) => {
        if (!arrowRef.current) {
          return {};
        }
        const {
          width,
          height
        } = arrowRef.current.getBoundingClientRect();
        const sideAxis = getSideAxis(getSide(limitData.placement));
        const arrowSize = sideAxis === "y" ? width : height;
        const offsetAmount = sideAxis === "y" ? collisionPadding.left + collisionPadding.right : collisionPadding.top + collisionPadding.bottom;
        return {
          offset: arrowSize / 2 + offsetAmount / 2
        };
      })
    };
  }, [commonCollisionProps, sticky, shiftCrossAxis, collisionPadding, collisionAvoidanceAlign]);
  if (collisionAvoidanceSide === "shift" || collisionAvoidanceAlign === "shift" || align === "center") {
    middleware.push(shiftMiddleware, flipMiddleware);
  } else {
    middleware.push(flipMiddleware, shiftMiddleware);
  }
  middleware.push(size({
    ...commonCollisionProps,
    apply({
      elements: {
        floating
      },
      rects: {
        reference
      },
      availableWidth,
      availableHeight
    }) {
      Object.entries({
        "--available-width": `${availableWidth}px`,
        "--available-height": `${availableHeight}px`,
        "--anchor-width": `${reference.width}px`,
        "--anchor-height": `${reference.height}px`
      }).forEach(([key, value]) => {
        floating.style.setProperty(key, value);
      });
    }
  }), arrow(() => ({
    // `transform-origin` calculations rely on an element existing. If the arrow hasn't been set,
    // we'll create a fake element.
    element: arrowRef.current || document.createElement("div"),
    padding: arrowPadding,
    offsetParent: "floating"
  }), [arrowPadding]), {
    name: "transformOrigin",
    fn(state) {
      const {
        elements: elements2,
        middlewareData: middlewareData2,
        placement: renderedPlacement2,
        rects,
        y: y2
      } = state;
      const currentRenderedSide = getSide(renderedPlacement2);
      const currentRenderedAxis = getSideAxis(currentRenderedSide);
      const arrowEl = arrowRef.current;
      const arrowX = middlewareData2.arrow?.x || 0;
      const arrowY = middlewareData2.arrow?.y || 0;
      const arrowWidth = arrowEl?.clientWidth || 0;
      const arrowHeight = arrowEl?.clientHeight || 0;
      const transformX = arrowX + arrowWidth / 2;
      const transformY = arrowY + arrowHeight / 2;
      const shiftY = Math.abs(middlewareData2.shift?.y || 0);
      const halfAnchorHeight = rects.reference.height / 2;
      const sideOffsetValue = typeof sideOffset === "function" ? sideOffset(getOffsetData(state, sideParam, isRtl)) : sideOffset;
      const isOverlappingAnchor = shiftY > sideOffsetValue;
      const adjacentTransformOrigin = {
        top: `${transformX}px calc(100% + ${sideOffsetValue}px)`,
        bottom: `${transformX}px ${-sideOffsetValue}px`,
        left: `calc(100% + ${sideOffsetValue}px) ${transformY}px`,
        right: `${-sideOffsetValue}px ${transformY}px`
      }[currentRenderedSide];
      const overlapTransformOrigin = `${transformX}px ${rects.reference.y + halfAnchorHeight - y2}px`;
      elements2.floating.style.setProperty("--transform-origin", crossAxisShiftEnabled && currentRenderedAxis === "y" && isOverlappingAnchor ? overlapTransformOrigin : adjacentTransformOrigin);
      return {};
    }
  }, hide, adaptiveOrigin2);
  useIsoLayoutEffect(() => {
    if (!mounted && floatingRootContext) {
      floatingRootContext.update({
        referenceElement: null,
        floatingElement: null,
        domReferenceElement: null
      });
    }
  }, [mounted, floatingRootContext]);
  const autoUpdateOptions = reactExports.useMemo(() => ({
    elementResize: !disableAnchorTracking && typeof ResizeObserver !== "undefined",
    layoutShift: !disableAnchorTracking && typeof IntersectionObserver !== "undefined"
  }), [disableAnchorTracking]);
  const {
    refs,
    elements,
    x,
    y,
    middlewareData,
    update,
    placement: renderedPlacement,
    context,
    isPositioned,
    floatingStyles: originalFloatingStyles
  } = useFloating({
    rootContext: floatingRootContext,
    placement,
    middleware,
    strategy: positionMethod,
    whileElementsMounted: keepMounted ? void 0 : (...args) => autoUpdate(...args, autoUpdateOptions),
    nodeId,
    externalTree
  });
  const {
    sideX,
    sideY
  } = middlewareData.adaptiveOrigin || DEFAULT_SIDES;
  const resolvedPosition = isPositioned ? positionMethod : "fixed";
  const floatingStyles = reactExports.useMemo(() => adaptiveOrigin2 ? {
    position: resolvedPosition,
    [sideX]: x,
    [sideY]: y
  } : {
    position: resolvedPosition,
    ...originalFloatingStyles
  }, [adaptiveOrigin2, resolvedPosition, sideX, x, sideY, y, originalFloatingStyles]);
  const registeredPositionReferenceRef = reactExports.useRef(null);
  useIsoLayoutEffect(() => {
    if (!mounted) {
      return;
    }
    const anchorValue = anchorValueRef.current;
    const resolvedAnchor = typeof anchorValue === "function" ? anchorValue() : anchorValue;
    const unwrappedElement = (isRef(resolvedAnchor) ? resolvedAnchor.current : resolvedAnchor) || null;
    const finalAnchor = unwrappedElement || null;
    if (finalAnchor !== registeredPositionReferenceRef.current) {
      refs.setPositionReference(finalAnchor);
      registeredPositionReferenceRef.current = finalAnchor;
    }
  }, [mounted, refs, anchorDep, anchorValueRef]);
  reactExports.useEffect(() => {
    if (!mounted) {
      return;
    }
    const anchorValue = anchorValueRef.current;
    if (typeof anchorValue === "function") {
      return;
    }
    if (isRef(anchorValue) && anchorValue.current !== registeredPositionReferenceRef.current) {
      refs.setPositionReference(anchorValue.current);
      registeredPositionReferenceRef.current = anchorValue.current;
    }
  }, [mounted, refs, anchorDep, anchorValueRef]);
  reactExports.useEffect(() => {
    if (keepMounted && mounted && elements.domReference && elements.floating) {
      return autoUpdate(elements.domReference, elements.floating, update, autoUpdateOptions);
    }
    return void 0;
  }, [keepMounted, mounted, elements, update, autoUpdateOptions]);
  const renderedSide = getSide(renderedPlacement);
  const logicalRenderedSide = getLogicalSide(sideParam, renderedSide, isRtl);
  const renderedAlign = getAlignment(renderedPlacement) || "center";
  const anchorHidden = Boolean(middlewareData.hide?.referenceHidden);
  useIsoLayoutEffect(() => {
    if (lazyFlip && mounted && isPositioned) {
      setMountSide(renderedSide);
    }
  }, [lazyFlip, mounted, isPositioned, renderedSide]);
  const arrowStyles = reactExports.useMemo(() => ({
    position: "absolute",
    top: middlewareData.arrow?.y,
    left: middlewareData.arrow?.x
  }), [middlewareData.arrow]);
  const arrowUncentered = middlewareData.arrow?.centerOffset !== 0;
  return reactExports.useMemo(() => ({
    positionerStyles: floatingStyles,
    arrowStyles,
    arrowRef,
    arrowUncentered,
    side: logicalRenderedSide,
    align: renderedAlign,
    physicalSide: renderedSide,
    anchorHidden,
    refs,
    context,
    isPositioned,
    update
  }), [floatingStyles, arrowStyles, arrowRef, arrowUncentered, logicalRenderedSide, renderedAlign, renderedSide, anchorHidden, refs, context, isPositioned, update]);
}
function isRef(param) {
  return param != null && "current" in param;
}
let CommonPopupDataAttributes = (function(CommonPopupDataAttributes2) {
  CommonPopupDataAttributes2["open"] = "data-open";
  CommonPopupDataAttributes2["closed"] = "data-closed";
  CommonPopupDataAttributes2[CommonPopupDataAttributes2["startingStyle"] = TransitionStatusDataAttributes.startingStyle] = "startingStyle";
  CommonPopupDataAttributes2[CommonPopupDataAttributes2["endingStyle"] = TransitionStatusDataAttributes.endingStyle] = "endingStyle";
  CommonPopupDataAttributes2["anchorHidden"] = "data-anchor-hidden";
  return CommonPopupDataAttributes2;
})({});
let CommonTriggerDataAttributes = /* @__PURE__ */ (function(CommonTriggerDataAttributes2) {
  CommonTriggerDataAttributes2["popupOpen"] = "data-popup-open";
  CommonTriggerDataAttributes2["pressed"] = "data-pressed";
  return CommonTriggerDataAttributes2;
})({});
const TRIGGER_HOOK = {
  [CommonTriggerDataAttributes.popupOpen]: ""
};
const PRESSABLE_TRIGGER_HOOK = {
  [CommonTriggerDataAttributes.popupOpen]: "",
  [CommonTriggerDataAttributes.pressed]: ""
};
const POPUP_OPEN_HOOK = {
  [CommonPopupDataAttributes.open]: ""
};
const POPUP_CLOSED_HOOK = {
  [CommonPopupDataAttributes.closed]: ""
};
const ANCHOR_HIDDEN_HOOK = {
  [CommonPopupDataAttributes.anchorHidden]: ""
};
const triggerOpenStateMapping = {
  open(value) {
    if (value) {
      return TRIGGER_HOOK;
    }
    return null;
  }
};
const pressableTriggerOpenStateMapping = {
  open(value) {
    if (value) {
      return PRESSABLE_TRIGGER_HOOK;
    }
    return null;
  }
};
const popupStateMapping = {
  open(value) {
    if (value) {
      return POPUP_OPEN_HOOK;
    }
    return POPUP_CLOSED_HOOK;
  },
  anchorHidden(value) {
    if (value) {
      return ANCHOR_HIDDEN_HOOK;
    }
    return null;
  }
};
function useToastManager() {
  const context = reactExports.useContext(ToastContext);
  if (!context) {
    throw new Error(formatErrorMessage(73));
  }
  const {
    toasts,
    add,
    close,
    update,
    promise
  } = context;
  return reactExports.useMemo(() => ({
    toasts,
    add,
    close,
    update,
    promise
  }), [toasts, add, close, update, promise]);
}
function createToastManager() {
  const listeners = [];
  function emit(data) {
    listeners.forEach((listener) => listener(data));
  }
  return {
    // This should be private aside from ToastProvider needing to access it.
    // https://x.com/drosenwasser/status/1816947740032872664
    " subscribe": function subscribe(listener) {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index !== -1) {
          listeners.splice(index, 1);
        }
      };
    },
    add(options) {
      const id = options.id || generateId("toast");
      const toastToAdd = {
        ...options,
        id,
        transitionStatus: "starting"
      };
      emit({
        action: "add",
        options: toastToAdd
      });
      return id;
    },
    close(id) {
      emit({
        action: "close",
        options: {
          id
        }
      });
    },
    update(id, updates) {
      emit({
        action: "update",
        options: {
          ...updates,
          id
        }
      });
    },
    promise(promiseValue, options) {
      let handledPromise = promiseValue;
      emit({
        action: "promise",
        options: {
          ...options,
          promise: promiseValue,
          setPromise(promise) {
            handledPromise = promise;
          }
        }
      });
      return handledPromise;
    }
  };
}
let FieldControlDataAttributes = /* @__PURE__ */ (function(FieldControlDataAttributes2) {
  FieldControlDataAttributes2["disabled"] = "data-disabled";
  FieldControlDataAttributes2["valid"] = "data-valid";
  FieldControlDataAttributes2["invalid"] = "data-invalid";
  FieldControlDataAttributes2["touched"] = "data-touched";
  FieldControlDataAttributes2["dirty"] = "data-dirty";
  FieldControlDataAttributes2["filled"] = "data-filled";
  FieldControlDataAttributes2["focused"] = "data-focused";
  return FieldControlDataAttributes2;
})({});
const DEFAULT_VALIDITY_STATE = {
  badInput: false,
  customError: false,
  patternMismatch: false,
  rangeOverflow: false,
  rangeUnderflow: false,
  stepMismatch: false,
  tooLong: false,
  tooShort: false,
  typeMismatch: false,
  valid: null,
  valueMissing: false
};
const fieldValidityMapping = {
  valid(value) {
    if (value === null) {
      return null;
    }
    if (value) {
      return {
        [FieldControlDataAttributes.valid]: ""
      };
    }
    return {
      [FieldControlDataAttributes.invalid]: ""
    };
  }
};
const FieldRootContext = /* @__PURE__ */ reactExports.createContext({
  invalid: void 0,
  name: void 0,
  validityData: {
    state: DEFAULT_VALIDITY_STATE,
    errors: [],
    error: "",
    value: "",
    initialValue: null
  },
  setValidityData: NOOP,
  disabled: void 0,
  touched: false,
  setTouched: NOOP,
  dirty: false,
  setDirty: NOOP,
  filled: false,
  setFilled: NOOP,
  focused: false,
  setFocused: NOOP,
  validate: () => null,
  validationMode: "onSubmit",
  validationDebounceTime: 0,
  shouldValidateOnChange: () => false,
  state: {
    disabled: false,
    valid: null,
    touched: false,
    dirty: false,
    filled: false,
    focused: false
  },
  markedDirtyRef: {
    current: false
  },
  validation: {
    getValidationProps: (props = EMPTY_OBJECT) => props,
    getInputValidationProps: (props = EMPTY_OBJECT) => props,
    inputRef: {
      current: null
    },
    commit: async () => {
    }
  }
});
function useFieldRootContext(optional = true) {
  const context = reactExports.useContext(FieldRootContext);
  if (context.setValidityData === NOOP && !optional) {
    throw new Error(formatErrorMessage(28));
  }
  return context;
}
const FieldsetRootContext = /* @__PURE__ */ reactExports.createContext({
  legendId: void 0,
  setLegendId: () => {
  },
  disabled: void 0
});
function useFieldsetRootContext(optional = false) {
  const context = reactExports.useContext(FieldsetRootContext);
  if (!context && !optional) {
    throw new Error(formatErrorMessage(86));
  }
  return context;
}
const FormContext = /* @__PURE__ */ reactExports.createContext({
  formRef: {
    current: {
      fields: /* @__PURE__ */ new Map()
    }
  },
  errors: {},
  clearErrors: NOOP,
  validationMode: "onSubmit",
  submitAttemptedRef: {
    current: false
  }
});
function useFormContext() {
  return reactExports.useContext(FormContext);
}
function useBaseUiId(idOverride) {
  return useId(idOverride, "base-ui");
}
const LabelableContext = /* @__PURE__ */ reactExports.createContext({
  controlId: void 0,
  setControlId: NOOP,
  labelId: void 0,
  setLabelId: NOOP,
  messageIds: [],
  setMessageIds: NOOP,
  getDescriptionProps: (externalProps) => externalProps
});
function useLabelableContext() {
  return reactExports.useContext(LabelableContext);
}
const LabelableProvider = function LabelableProvider2(props) {
  const defaultId = useBaseUiId();
  const [controlId, setControlId] = reactExports.useState(props.initialControlId === void 0 ? defaultId : props.initialControlId);
  const [labelId, setLabelId] = reactExports.useState(void 0);
  const [messageIds, setMessageIds] = reactExports.useState([]);
  const {
    messageIds: parentMessageIds
  } = useLabelableContext();
  const getDescriptionProps = reactExports.useCallback((externalProps) => {
    return mergeProps$1({
      "aria-describedby": parentMessageIds.concat(messageIds).join(" ") || void 0
    }, externalProps);
  }, [parentMessageIds, messageIds]);
  const contextValue = reactExports.useMemo(() => ({
    controlId,
    setControlId,
    labelId,
    setLabelId,
    messageIds,
    setMessageIds,
    getDescriptionProps
  }), [controlId, setControlId, labelId, setLabelId, messageIds, setMessageIds, getDescriptionProps]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LabelableContext.Provider, {
    value: contextValue,
    children: props.children
  });
};
function getCombinedFieldValidityData(validityData, invalid) {
  return {
    ...validityData,
    state: {
      ...validityData.state,
      valid: !invalid && validityData.state.valid
    }
  };
}
const validityKeys = Object.keys(DEFAULT_VALIDITY_STATE);
function isOnlyValueMissing(state) {
  if (!state || state.valid || !state.valueMissing) {
    return false;
  }
  let onlyValueMissing = false;
  for (const key of validityKeys) {
    if (key === "valid") {
      continue;
    }
    if (key === "valueMissing") {
      onlyValueMissing = state[key];
    }
    if (state[key]) {
      onlyValueMissing = false;
    }
  }
  return onlyValueMissing;
}
function useFieldValidation(params) {
  const {
    formRef,
    clearErrors
  } = useFormContext();
  const {
    setValidityData,
    validate,
    validityData,
    validationDebounceTime,
    invalid,
    markedDirtyRef,
    state,
    name,
    shouldValidateOnChange
  } = params;
  const {
    controlId,
    getDescriptionProps
  } = useLabelableContext();
  const timeout = useTimeout();
  const inputRef = reactExports.useRef(null);
  const commit = useStableCallback(async (value, revalidate = false) => {
    const element = inputRef.current;
    if (!element) {
      return;
    }
    if (revalidate) {
      if (state.valid !== false) {
        return;
      }
      const currentNativeValidity = element.validity;
      if (!currentNativeValidity.valueMissing) {
        const nextValidityData2 = {
          value,
          state: {
            ...DEFAULT_VALIDITY_STATE,
            valid: true
          },
          error: "",
          errors: [],
          initialValue: validityData.initialValue
        };
        element.setCustomValidity("");
        if (controlId) {
          const currentFieldData = formRef.current.fields.get(controlId);
          if (currentFieldData) {
            formRef.current.fields.set(controlId, {
              ...currentFieldData,
              ...getCombinedFieldValidityData(nextValidityData2, false)
              // invalid = false
            });
          }
        }
        setValidityData(nextValidityData2);
        return;
      }
      const currentNativeValidityObject = validityKeys.reduce((acc, key) => {
        acc[key] = currentNativeValidity[key];
        return acc;
      }, {});
      if (!currentNativeValidityObject.valid && !isOnlyValueMissing(currentNativeValidityObject)) {
        return;
      }
    }
    function getState(el) {
      const computedState = validityKeys.reduce((acc, key) => {
        acc[key] = el.validity[key];
        return acc;
      }, {});
      let hasOnlyValueMissingError = false;
      for (const key of validityKeys) {
        if (key === "valid") {
          continue;
        }
        if (key === "valueMissing" && computedState[key]) {
          hasOnlyValueMissingError = true;
        } else if (computedState[key]) {
          return computedState;
        }
      }
      if (hasOnlyValueMissingError && !markedDirtyRef.current) {
        computedState.valid = true;
        computedState.valueMissing = false;
      }
      return computedState;
    }
    timeout.clear();
    let result = null;
    let validationErrors = [];
    const nextState = getState(element);
    let defaultValidationMessage;
    const validateOnChange = shouldValidateOnChange();
    if (element.validationMessage && !validateOnChange) {
      defaultValidationMessage = element.validationMessage;
      validationErrors = [element.validationMessage];
    } else {
      const formValues = Array.from(formRef.current.fields.values()).reduce((acc, field) => {
        if (field.name) {
          acc[field.name] = field.getValue();
        }
        return acc;
      }, {});
      const resultOrPromise = validate(value, formValues);
      if (typeof resultOrPromise === "object" && resultOrPromise !== null && "then" in resultOrPromise) {
        result = await resultOrPromise;
      } else {
        result = resultOrPromise;
      }
      if (result !== null) {
        nextState.valid = false;
        nextState.customError = true;
        if (Array.isArray(result)) {
          validationErrors = result;
          element.setCustomValidity(result.join("\n"));
        } else if (result) {
          validationErrors = [result];
          element.setCustomValidity(result);
        }
      } else if (validateOnChange) {
        element.setCustomValidity("");
        nextState.customError = false;
        if (element.validationMessage) {
          defaultValidationMessage = element.validationMessage;
          validationErrors = [element.validationMessage];
        } else if (element.validity.valid && !nextState.valid) {
          nextState.valid = true;
        }
      }
    }
    const nextValidityData = {
      value,
      state: nextState,
      error: defaultValidationMessage ?? (Array.isArray(result) ? result[0] : result ?? ""),
      errors: validationErrors,
      initialValue: validityData.initialValue
    };
    if (controlId) {
      const currentFieldData = formRef.current.fields.get(controlId);
      if (currentFieldData) {
        formRef.current.fields.set(controlId, {
          ...currentFieldData,
          ...getCombinedFieldValidityData(nextValidityData, invalid)
        });
      }
    }
    setValidityData(nextValidityData);
  });
  const getValidationProps = reactExports.useCallback((externalProps = {}) => mergeProps$1(getDescriptionProps, state.valid === false ? {
    "aria-invalid": true
  } : EMPTY_OBJECT, externalProps), [getDescriptionProps, state.valid]);
  const getInputValidationProps = reactExports.useCallback((externalProps = {}) => mergeProps$1({
    onChange(event) {
      if (event.nativeEvent.defaultPrevented) {
        return;
      }
      clearErrors(name);
      if (!shouldValidateOnChange()) {
        commit(event.currentTarget.value, true);
        return;
      }
      if (invalid) {
        return;
      }
      const element = event.currentTarget;
      if (element.value === "") {
        commit(element.value);
        return;
      }
      timeout.clear();
      if (validationDebounceTime) {
        timeout.start(validationDebounceTime, () => {
          commit(element.value);
        });
      } else {
        commit(element.value);
      }
    }
  }, getValidationProps(externalProps)), [getValidationProps, clearErrors, name, timeout, commit, invalid, validationDebounceTime, shouldValidateOnChange]);
  return reactExports.useMemo(() => ({
    getValidationProps,
    getInputValidationProps,
    inputRef,
    commit
  }), [getValidationProps, getInputValidationProps, commit]);
}
const FieldRootInner = /* @__PURE__ */ reactExports.forwardRef(function FieldRootInner2(componentProps, forwardedRef) {
  const {
    errors,
    validationMode: formValidationMode,
    submitAttemptedRef
  } = useFormContext();
  const {
    render,
    className,
    validate: validateProp,
    validationDebounceTime = 0,
    validationMode = formValidationMode,
    name,
    disabled: disabledProp = false,
    invalid: invalidProp,
    dirty: dirtyProp,
    touched: touchedProp,
    actionsRef,
    ...elementProps
  } = componentProps;
  const {
    disabled: disabledFieldset
  } = useFieldsetRootContext();
  const validate = useStableCallback(validateProp || (() => null));
  const disabled = disabledFieldset || disabledProp;
  const [touchedState, setTouchedUnwrapped] = reactExports.useState(false);
  const [dirtyState, setDirtyUnwrapped] = reactExports.useState(false);
  const [filled, setFilled] = reactExports.useState(false);
  const [focused, setFocused] = reactExports.useState(false);
  const dirty = dirtyProp ?? dirtyState;
  const touched = touchedProp ?? touchedState;
  const markedDirtyRef = reactExports.useRef(false);
  const setDirty = useStableCallback((value) => {
    if (dirtyProp !== void 0) {
      return;
    }
    if (value) {
      markedDirtyRef.current = true;
    }
    setDirtyUnwrapped(value);
  });
  const setTouched = useStableCallback((value) => {
    if (touchedProp !== void 0) {
      return;
    }
    setTouchedUnwrapped(value);
  });
  const shouldValidateOnChange = useStableCallback(() => validationMode === "onChange" || validationMode === "onSubmit" && submitAttemptedRef.current);
  const invalid = Boolean(invalidProp || name && {}.hasOwnProperty.call(errors, name) && errors[name] !== void 0);
  const [validityData, setValidityData] = reactExports.useState({
    state: DEFAULT_VALIDITY_STATE,
    error: "",
    errors: [],
    value: null,
    initialValue: null
  });
  const valid = !invalid && validityData.state.valid;
  const state = reactExports.useMemo(() => ({
    disabled,
    touched,
    dirty,
    valid,
    filled,
    focused
  }), [disabled, touched, dirty, valid, filled, focused]);
  const validation = useFieldValidation({
    setValidityData,
    validate,
    validityData,
    validationDebounceTime,
    invalid,
    markedDirtyRef,
    state,
    name,
    shouldValidateOnChange
  });
  const handleImperativeValidate = reactExports.useCallback(() => {
    markedDirtyRef.current = true;
    validation.commit(validityData.value);
  }, [validation, validityData]);
  reactExports.useImperativeHandle(actionsRef, () => ({
    validate: handleImperativeValidate
  }), [handleImperativeValidate]);
  const contextValue = reactExports.useMemo(() => ({
    invalid,
    name,
    validityData,
    setValidityData,
    disabled,
    touched,
    setTouched,
    dirty,
    setDirty,
    filled,
    setFilled,
    focused,
    setFocused,
    validate,
    validationMode,
    validationDebounceTime,
    shouldValidateOnChange,
    state,
    markedDirtyRef,
    validation
  }), [invalid, name, validityData, disabled, touched, setTouched, dirty, setDirty, filled, setFilled, focused, setFocused, validate, validationMode, validationDebounceTime, shouldValidateOnChange, state, validation]);
  const element = useRenderElement("div", componentProps, {
    ref: forwardedRef,
    state,
    props: elementProps,
    stateAttributesMapping: fieldValidityMapping
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRootContext.Provider, {
    value: contextValue,
    children: element
  });
});
const FieldRoot = /* @__PURE__ */ reactExports.forwardRef(function FieldRoot2(componentProps, forwardedRef) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LabelableProvider, {
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(FieldRootInner, {
      ...componentProps,
      ref: forwardedRef
    })
  });
});
const FieldLabel = /* @__PURE__ */ reactExports.forwardRef(function FieldLabel2(componentProps, forwardedRef) {
  const {
    render,
    className,
    id: idProp,
    nativeLabel = true,
    ...elementProps
  } = componentProps;
  const fieldRootContext = useFieldRootContext(false);
  const {
    controlId,
    setLabelId,
    labelId
  } = useLabelableContext();
  const id = useBaseUiId(idProp);
  const labelRef = reactExports.useRef(null);
  const handleInteraction = useStableCallback((event) => {
    const target = getTarget(event.nativeEvent);
    if (target?.closest("button,input,select,textarea")) {
      return;
    }
    if (!event.defaultPrevented && event.detail > 1) {
      event.preventDefault();
    }
    if (nativeLabel || !controlId) {
      return;
    }
    const controlElement = ownerDocument(event.currentTarget).getElementById(controlId);
    if (isHTMLElement(controlElement)) {
      controlElement.focus({
        // Available from Chrome 144+ (January 2026).
        // Safari and Firefox already support it.
        // @ts-expect-error not available in types yet
        focusVisible: true
      });
    }
  });
  useIsoLayoutEffect(() => {
    if (id) {
      setLabelId(id);
    }
    return () => {
      setLabelId(void 0);
    };
  }, [id, setLabelId]);
  const element = useRenderElement("label", componentProps, {
    ref: [forwardedRef, labelRef],
    state: fieldRootContext.state,
    props: [{
      id: labelId
    }, nativeLabel ? {
      htmlFor: controlId ?? void 0,
      onMouseDown: handleInteraction
    } : {
      onClick: handleInteraction,
      onPointerDown(event) {
        event.preventDefault();
      }
    }, elementProps],
    stateAttributesMapping: fieldValidityMapping
  });
  return element;
});
const FieldError = /* @__PURE__ */ reactExports.forwardRef(function FieldError2(componentProps, forwardedRef) {
  const {
    render,
    id: idProp,
    className,
    match,
    ...elementProps
  } = componentProps;
  const id = useBaseUiId(idProp);
  const {
    validityData,
    state,
    name
  } = useFieldRootContext(false);
  const {
    setMessageIds
  } = useLabelableContext();
  const {
    errors
  } = useFormContext();
  const formError = name ? errors[name] : null;
  let rendered = false;
  if (formError || match === true) {
    rendered = true;
  } else if (match) {
    rendered = Boolean(validityData.state[match]);
  } else {
    rendered = validityData.state.valid === false;
  }
  useIsoLayoutEffect(() => {
    if (!rendered || !id) {
      return void 0;
    }
    setMessageIds((v) => v.concat(id));
    return () => {
      setMessageIds((v) => v.filter((item) => item !== id));
    };
  }, [rendered, id, setMessageIds]);
  const element = useRenderElement("div", componentProps, {
    ref: forwardedRef,
    state,
    props: [{
      id,
      children: formError || (validityData.errors.length > 1 ? /* @__PURE__ */ reactExports.createElement("ul", {}, validityData.errors.map((message) => /* @__PURE__ */ reactExports.createElement("li", {
        key: message
      }, message))) : validityData.error)
    }, elementProps],
    stateAttributesMapping: fieldValidityMapping
  });
  if (!rendered) {
    return null;
  }
  return element;
});
function useLabelableId(params = {}) {
  const {
    id,
    implicit = false,
    controlRef
  } = params;
  const {
    controlId,
    setControlId
  } = useLabelableContext();
  const defaultId = useBaseUiId(id);
  useIsoLayoutEffect(() => {
    if (!implicit && !id || setControlId === NOOP) {
      return void 0;
    }
    if (implicit) {
      const elem = controlRef?.current;
      if (isElement(elem) && elem.closest("label") != null) {
        setControlId(id ?? null);
      } else {
        setControlId(controlId ?? defaultId);
      }
    } else if (id) {
      setControlId(id);
    }
    return () => {
      if (id) {
        setControlId(void 0);
      }
    };
  }, [id, controlRef, controlId, setControlId, implicit, defaultId]);
  return controlId ?? defaultId;
}
function useField(params) {
  const {
    enabled = true,
    value,
    id,
    name,
    controlRef,
    commit
  } = params;
  const {
    formRef
  } = useFormContext();
  const {
    invalid,
    markedDirtyRef,
    validityData,
    setValidityData
  } = useFieldRootContext();
  const getValue = useStableCallback(params.getValue);
  useIsoLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    let initialValue = value;
    if (initialValue === void 0) {
      initialValue = getValue();
    }
    if (validityData.initialValue === null && initialValue !== null) {
      setValidityData((prev) => ({
        ...prev,
        initialValue
      }));
    }
  }, [enabled, setValidityData, value, validityData.initialValue, getValue]);
  useIsoLayoutEffect(() => {
    if (!enabled || !id) {
      return;
    }
    formRef.current.fields.set(id, {
      getValue,
      name,
      controlRef,
      validityData: getCombinedFieldValidityData(validityData, invalid),
      validate(flushSync = true) {
        let nextValue = value;
        if (nextValue === void 0) {
          nextValue = getValue();
        }
        markedDirtyRef.current = true;
        if (!flushSync) {
          commit(nextValue);
        } else {
          reactDomExports.flushSync(() => commit(nextValue));
        }
      }
    });
  }, [commit, controlRef, enabled, formRef, getValue, id, invalid, markedDirtyRef, name, validityData, value]);
  useIsoLayoutEffect(() => {
    const fields = formRef.current.fields;
    return () => {
      if (id) {
        fields.delete(id);
      }
    };
  }, [formRef, id]);
}
const FieldControl = /* @__PURE__ */ reactExports.forwardRef(function FieldControl2(componentProps, forwardedRef) {
  const {
    render,
    className,
    id: idProp,
    name: nameProp,
    value: valueProp,
    disabled: disabledProp = false,
    onValueChange,
    defaultValue,
    ...elementProps
  } = componentProps;
  const {
    state: fieldState,
    name: fieldName,
    disabled: fieldDisabled
  } = useFieldRootContext();
  const disabled = fieldDisabled || disabledProp;
  const name = fieldName ?? nameProp;
  const state = reactExports.useMemo(() => ({
    ...fieldState,
    disabled
  }), [fieldState, disabled]);
  const {
    setTouched,
    setDirty,
    validityData,
    setFocused,
    setFilled,
    validationMode,
    validation
  } = useFieldRootContext();
  const {
    labelId
  } = useLabelableContext();
  const id = useLabelableId({
    id: idProp
  });
  useIsoLayoutEffect(() => {
    const hasExternalValue = valueProp != null;
    if (validation.inputRef.current?.value || hasExternalValue && valueProp !== "") {
      setFilled(true);
    } else if (hasExternalValue && valueProp === "") {
      setFilled(false);
    }
  }, [validation.inputRef, setFilled, valueProp]);
  const [value, setValueUnwrapped] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: "FieldControl",
    state: "value"
  });
  const isControlled = valueProp !== void 0;
  const setValue = useStableCallback((nextValue, eventDetails) => {
    onValueChange?.(nextValue, eventDetails);
    if (eventDetails.isCanceled) {
      return;
    }
    setValueUnwrapped(nextValue);
  });
  useField({
    id,
    name,
    commit: validation.commit,
    value,
    getValue: () => validation.inputRef.current?.value,
    controlRef: validation.inputRef
  });
  const element = useRenderElement("input", componentProps, {
    ref: forwardedRef,
    state,
    props: [{
      id,
      disabled,
      name,
      ref: validation.inputRef,
      "aria-labelledby": labelId,
      ...isControlled ? {
        value
      } : {
        defaultValue
      },
      onChange(event) {
        const inputValue = event.currentTarget.value;
        setValue(inputValue, createChangeEventDetails(none, event.nativeEvent));
        setDirty(inputValue !== validityData.initialValue);
        setFilled(inputValue !== "");
      },
      onFocus() {
        setFocused(true);
      },
      onBlur(event) {
        setTouched(true);
        setFocused(false);
        if (validationMode === "onBlur") {
          validation.commit(event.currentTarget.value);
        }
      },
      onKeyDown(event) {
        if (event.currentTarget.tagName === "INPUT" && event.key === "Enter") {
          setTouched(true);
          validation.commit(event.currentTarget.value);
        }
      }
    }, validation.getInputValidationProps(), elementProps],
    stateAttributesMapping: fieldValidityMapping
  });
  return element;
});
const PopoverRootContext = /* @__PURE__ */ reactExports.createContext(void 0);
function usePopoverRootContext(optional) {
  const context = reactExports.useContext(PopoverRootContext);
  if (context === void 0 && !optional) {
    throw new Error(formatErrorMessage(47));
  }
  return context;
}
function createInitialState$2() {
  return {
    ...createInitialPopupStoreState(),
    disabled: false,
    modal: false,
    instantType: void 0,
    openMethod: null,
    openChangeReason: null,
    titleElementId: void 0,
    descriptionElementId: void 0,
    stickIfOpen: true,
    nested: false,
    openOnHover: false,
    closeDelay: 0,
    hasViewport: false
  };
}
const selectors$2 = {
  ...popupStoreSelectors,
  disabled: createSelector((state) => state.disabled),
  instantType: createSelector((state) => state.instantType),
  openMethod: createSelector((state) => state.openMethod),
  openChangeReason: createSelector((state) => state.openChangeReason),
  modal: createSelector((state) => state.modal),
  stickIfOpen: createSelector((state) => state.stickIfOpen),
  titleElementId: createSelector((state) => state.titleElementId),
  descriptionElementId: createSelector((state) => state.descriptionElementId),
  openOnHover: createSelector((state) => state.openOnHover),
  closeDelay: createSelector((state) => state.closeDelay),
  hasViewport: createSelector((state) => state.hasViewport)
};
class PopoverStore extends ReactStore {
  constructor(initialState) {
    const initial = {
      ...createInitialState$2(),
      ...initialState
    };
    if (initial.open && initialState?.mounted === void 0) {
      initial.mounted = true;
    }
    super(initial, {
      popupRef: /* @__PURE__ */ reactExports.createRef(),
      backdropRef: /* @__PURE__ */ reactExports.createRef(),
      internalBackdropRef: /* @__PURE__ */ reactExports.createRef(),
      onOpenChange: void 0,
      onOpenChangeComplete: void 0,
      triggerFocusTargetRef: /* @__PURE__ */ reactExports.createRef(),
      beforeContentFocusGuardRef: /* @__PURE__ */ reactExports.createRef(),
      stickIfOpenTimeout: new Timeout(),
      triggerElements: new PopupTriggerMap()
    }, selectors$2);
  }
  setOpen = (nextOpen, eventDetails) => {
    const isHover = eventDetails.reason === triggerHover;
    const isKeyboardClick = eventDetails.reason === triggerPress && eventDetails.event.detail === 0;
    const isDismissClose = !nextOpen && (eventDetails.reason === escapeKey || eventDetails.reason == null);
    eventDetails.preventUnmountOnClose = () => {
      this.set("preventUnmountingOnClose", true);
    };
    this.context.onOpenChange?.(nextOpen, eventDetails);
    if (eventDetails.isCanceled) {
      return;
    }
    const details = {
      open: nextOpen,
      nativeEvent: eventDetails.event,
      reason: eventDetails.reason,
      nested: this.state.nested,
      triggerElement: eventDetails.trigger
    };
    const floatingEvents = this.state.floatingRootContext.context.events;
    floatingEvents?.emit("openchange", details);
    const changeState = () => {
      const updatedState = {
        open: nextOpen,
        openChangeReason: eventDetails.reason
      };
      const newTriggerId = eventDetails.trigger?.id ?? null;
      if (newTriggerId || nextOpen) {
        updatedState.activeTriggerId = newTriggerId;
        updatedState.activeTriggerElement = eventDetails.trigger ?? null;
      }
      this.update(updatedState);
    };
    if (isHover) {
      this.set("stickIfOpen", true);
      this.context.stickIfOpenTimeout.start(PATIENT_CLICK_THRESHOLD, () => {
        this.set("stickIfOpen", false);
      });
      reactDomExports.flushSync(changeState);
    } else {
      changeState();
    }
    if (isKeyboardClick || isDismissClose) {
      this.set("instantType", isKeyboardClick ? "click" : "dismiss");
    } else if (eventDetails.reason === focusOut) {
      this.set("instantType", "focus");
    } else {
      this.set("instantType", void 0);
    }
  };
  static useStore(externalStore, initialState) {
    const internalStore = useRefWithInit(() => {
      return new PopoverStore(initialState);
    }).current;
    const store = externalStore ?? internalStore;
    useOnMount(internalStore.disposeEffect);
    return store;
  }
  disposeEffect = () => {
    return this.context.stickIfOpenTimeout.disposeEffect();
  };
}
function useOpenInteractionType(open) {
  const [openMethod, setOpenMethod] = reactExports.useState(null);
  const handleTriggerClick = useStableCallback((_, interactionType) => {
    if (!open) {
      setOpenMethod(interactionType || // On iOS Safari, the hitslop around touch targets means tapping outside an element's
      // bounds does not fire `pointerdown` but does fire `mousedown`. The `interactionType`
      // will be "" in that case.
      (isIOS ? "touch" : ""));
    }
  });
  const reset = reactExports.useCallback(() => {
    setOpenMethod(null);
  }, []);
  const {
    onClick,
    onPointerDown
  } = useEnhancedClickHandler(handleTriggerClick);
  return reactExports.useMemo(() => ({
    openMethod,
    reset,
    triggerProps: {
      onClick,
      onPointerDown
    }
  }), [openMethod, reset, onClick, onPointerDown]);
}
function PopoverRootComponent({
  props
}) {
  const {
    children,
    open: openProp,
    defaultOpen: defaultOpenProp = false,
    onOpenChange,
    onOpenChangeComplete,
    modal = false,
    handle,
    triggerId: triggerIdProp,
    defaultTriggerId: defaultTriggerIdProp = null
  } = props;
  const store = PopoverStore.useStore(handle?.store, {
    open: openProp ?? defaultOpenProp,
    modal,
    activeTriggerId: triggerIdProp !== void 0 ? triggerIdProp : defaultTriggerIdProp
  });
  store.useControlledProp("open", openProp, defaultOpenProp);
  store.useControlledProp("activeTriggerId", triggerIdProp, defaultTriggerIdProp);
  const open = store.useState("open");
  const positionerElement = store.useState("positionerElement");
  const payload = store.useState("payload");
  const openReason = store.useState("openChangeReason");
  store.useContextCallback("onOpenChange", onOpenChange);
  store.useContextCallback("onOpenChangeComplete", onOpenChangeComplete);
  const {
    openMethod,
    triggerProps: interactionTypeTriggerProps,
    reset: resetOpenInteractionType
  } = useOpenInteractionType(open);
  useImplicitActiveTrigger(store);
  const {
    forceUnmount
  } = useOpenStateTransitions(open, store, () => {
    store.update({
      stickIfOpen: true,
      openChangeReason: null
    });
    resetOpenInteractionType();
  });
  useScrollLock(open && modal === true && openReason !== triggerHover && openMethod !== "touch", positionerElement);
  reactExports.useEffect(() => {
    if (!open) {
      store.context.stickIfOpenTimeout.clear();
    }
  }, [store, open]);
  const createPopoverEventDetails = reactExports.useCallback((reason) => {
    const details = createChangeEventDetails(reason);
    details.preventUnmountOnClose = () => {
      store.set("preventUnmountingOnClose", true);
    };
    return details;
  }, [store]);
  const handleImperativeClose = reactExports.useCallback(() => {
    store.setOpen(false, createPopoverEventDetails(imperativeAction));
  }, [store, createPopoverEventDetails]);
  reactExports.useImperativeHandle(props.actionsRef, () => ({
    unmount: forceUnmount,
    close: handleImperativeClose
  }), [forceUnmount, handleImperativeClose]);
  const floatingRootContext = useSyncedFloatingRootContext({
    popupStore: store,
    onOpenChange: store.setOpen
  });
  const dismiss = useDismiss(floatingRootContext, {
    outsidePressEvent: {
      // Ensure `aria-hidden` on outside elements is removed immediately
      // on outside press when trapping focus.
      mouse: modal === "trap-focus" ? "sloppy" : "intentional",
      touch: "sloppy"
    }
  });
  const role = useRole(floatingRootContext);
  const {
    getReferenceProps,
    getFloatingProps,
    getTriggerProps
  } = useInteractions([dismiss, role]);
  const activeTriggerProps = reactExports.useMemo(() => {
    return getReferenceProps(interactionTypeTriggerProps);
  }, [getReferenceProps, interactionTypeTriggerProps]);
  const inactiveTriggerProps = reactExports.useMemo(() => {
    return getTriggerProps(interactionTypeTriggerProps);
  }, [getTriggerProps, interactionTypeTriggerProps]);
  const popupProps = reactExports.useMemo(() => {
    return getFloatingProps();
  }, [getFloatingProps]);
  store.useSyncedValues({
    modal,
    openMethod,
    activeTriggerProps,
    inactiveTriggerProps,
    popupProps,
    floatingRootContext,
    nested: useFloatingParentNodeId() != null
  });
  const popoverContext = reactExports.useMemo(() => ({
    store
  }), [store]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverRootContext.Provider, {
    value: popoverContext,
    children: typeof children === "function" ? children({
      payload
    }) : children
  });
}
function PopoverRoot(props) {
  if (usePopoverRootContext(true)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverRootComponent, {
      props
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingTree, {
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverRootComponent, {
      props
    })
  });
}
const OPEN_DELAY = 300;
const PopoverTrigger = /* @__PURE__ */ reactExports.forwardRef(function PopoverTrigger2(componentProps, forwardedRef) {
  const {
    render,
    className,
    disabled = false,
    nativeButton = true,
    handle,
    payload,
    openOnHover = false,
    delay = OPEN_DELAY,
    closeDelay = 0,
    id: idProp,
    ...elementProps
  } = componentProps;
  const rootContext = usePopoverRootContext(true);
  const store = handle?.store ?? rootContext?.store;
  if (!store) {
    throw new Error(formatErrorMessage(74));
  }
  const thisTriggerId = useBaseUiId(idProp);
  const isTriggerActive = store.useState("isTriggerActive", thisTriggerId);
  const floatingContext = store.useState("floatingRootContext");
  const isOpenedByThisTrigger = store.useState("isOpenedByTrigger", thisTriggerId);
  const triggerElementRef = reactExports.useRef(null);
  const {
    registerTrigger,
    isMountedByThisTrigger
  } = useTriggerDataForwarding(thisTriggerId, triggerElementRef, store, {
    payload,
    disabled,
    openOnHover,
    closeDelay
  });
  const openReason = store.useState("openChangeReason");
  const stickIfOpen = store.useState("stickIfOpen");
  const openMethod = store.useState("openMethod");
  const hoverProps = useHoverReferenceInteraction(floatingContext, {
    enabled: floatingContext != null && openOnHover && (openMethod !== "touch" || openReason !== triggerPress),
    mouseOnly: true,
    move: false,
    handleClose: safePolygon(),
    restMs: delay,
    delay: {
      close: closeDelay
    },
    triggerElementRef,
    isActiveTrigger: isTriggerActive
  });
  const click = useClick(floatingContext, {
    enabled: floatingContext != null,
    stickIfOpen
  });
  const localProps = useInteractions([click]);
  const rootTriggerProps = store.useState("triggerProps", isMountedByThisTrigger);
  const state = reactExports.useMemo(() => ({
    disabled,
    open: isOpenedByThisTrigger
  }), [disabled, isOpenedByThisTrigger]);
  const {
    getButtonProps,
    buttonRef
  } = useButton({
    disabled,
    native: nativeButton
  });
  const stateAttributesMapping2 = reactExports.useMemo(() => ({
    open(value) {
      if (value && openReason === triggerPress) {
        return pressableTriggerOpenStateMapping.open(value);
      }
      return triggerOpenStateMapping.open(value);
    }
  }), [openReason]);
  const element = useRenderElement("button", componentProps, {
    state,
    ref: [buttonRef, forwardedRef, registerTrigger, triggerElementRef],
    props: [localProps.getReferenceProps(), hoverProps, rootTriggerProps, {
      [CLICK_TRIGGER_IDENTIFIER]: "",
      id: thisTriggerId
    }, elementProps, getButtonProps],
    stateAttributesMapping: stateAttributesMapping2
  });
  const preFocusGuardRef = reactExports.useRef(null);
  const handlePreFocusGuardFocus = useStableCallback((event) => {
    reactDomExports.flushSync(() => {
      store.setOpen(false, createChangeEventDetails(focusOut, event.nativeEvent, event.currentTarget));
    });
    const previousTabbable = getTabbableBeforeElement(preFocusGuardRef.current);
    previousTabbable?.focus();
  });
  const handleFocusTargetFocus = useStableCallback((event) => {
    const positionerElement = store.select("positionerElement");
    if (positionerElement && isOutsideEvent(event, positionerElement)) {
      store.context.beforeContentFocusGuardRef.current?.focus();
    } else {
      reactDomExports.flushSync(() => {
        store.setOpen(false, createChangeEventDetails(focusOut, event.nativeEvent, event.currentTarget));
      });
      let nextTabbable = getTabbableAfterElement(store.context.triggerFocusTargetRef.current || triggerElementRef.current);
      while (nextTabbable !== null && contains(positionerElement, nextTabbable)) {
        const prevTabbable = nextTabbable;
        nextTabbable = getNextTabbable(nextTabbable);
        if (nextTabbable === prevTabbable) {
          break;
        }
      }
      nextTabbable?.focus();
    }
  });
  if (isTriggerActive) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, {
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx(FocusGuard, {
        ref: preFocusGuardRef,
        onFocus: handlePreFocusGuardFocus
      }), /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Fragment, {
        children: element
      }, thisTriggerId), /* @__PURE__ */ jsxRuntimeExports.jsx(FocusGuard, {
        ref: store.context.triggerFocusTargetRef,
        onFocus: handleFocusTargetFocus
      })]
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Fragment, {
    children: element
  }, thisTriggerId);
});
const PopoverPortalContext = /* @__PURE__ */ reactExports.createContext(void 0);
function usePopoverPortalContext() {
  const value = reactExports.useContext(PopoverPortalContext);
  if (value === void 0) {
    throw new Error(formatErrorMessage(45));
  }
  return value;
}
const PopoverPortal = /* @__PURE__ */ reactExports.forwardRef(function PopoverPortal2(props, forwardedRef) {
  const {
    keepMounted = false,
    ...portalProps
  } = props;
  const {
    store
  } = usePopoverRootContext();
  const mounted = store.useState("mounted");
  const shouldRender = mounted || keepMounted;
  if (!shouldRender) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverPortalContext.Provider, {
    value: keepMounted,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingPortal, {
      ref: forwardedRef,
      ...portalProps,
      renderGuards: false
    })
  });
});
const PopoverPositionerContext = /* @__PURE__ */ reactExports.createContext(void 0);
function usePopoverPositionerContext() {
  const context = reactExports.useContext(PopoverPositionerContext);
  if (!context) {
    throw new Error(formatErrorMessage(46));
  }
  return context;
}
const InternalBackdrop = /* @__PURE__ */ reactExports.forwardRef(function InternalBackdrop2(props, ref) {
  const {
    cutout,
    ...otherProps
  } = props;
  let clipPath;
  if (cutout) {
    const rect = cutout?.getBoundingClientRect();
    clipPath = `polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      0% 100%,
      0% 0%,
      ${rect.left}px ${rect.top}px,
      ${rect.left}px ${rect.bottom}px,
      ${rect.right}px ${rect.bottom}px,
      ${rect.right}px ${rect.top}px,
      ${rect.left}px ${rect.top}px
    )`;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    ref,
    role: "presentation",
    "data-base-ui-inert": "",
    ...otherProps,
    style: {
      position: "fixed",
      inset: 0,
      userSelect: "none",
      WebkitUserSelect: "none",
      clipPath
    }
  });
});
function getDisabledMountTransitionStyles(transitionStatus) {
  return transitionStatus === "starting" ? DISABLED_TRANSITIONS_STYLE : EMPTY_OBJECT;
}
const PopoverPositioner = /* @__PURE__ */ reactExports.forwardRef(function PopoverPositioner2(componentProps, forwardedRef) {
  const {
    render,
    className,
    anchor,
    positionMethod = "absolute",
    side = "bottom",
    align = "center",
    sideOffset = 0,
    alignOffset = 0,
    collisionBoundary = "clipping-ancestors",
    collisionPadding = 5,
    arrowPadding = 5,
    sticky = false,
    disableAnchorTracking = false,
    collisionAvoidance = POPUP_COLLISION_AVOIDANCE,
    ...elementProps
  } = componentProps;
  const {
    store
  } = usePopoverRootContext();
  const keepMounted = usePopoverPortalContext();
  const nodeId = useFloatingNodeId();
  const floatingRootContext = store.useState("floatingRootContext");
  const mounted = store.useState("mounted");
  const open = store.useState("open");
  const openReason = store.useState("openChangeReason");
  const triggerElement = store.useState("activeTriggerElement");
  const modal = store.useState("modal");
  const positionerElement = store.useState("positionerElement");
  const instantType = store.useState("instantType");
  const transitionStatus = store.useState("transitionStatus");
  const hasViewport = store.useState("hasViewport");
  const prevTriggerElementRef = reactExports.useRef(null);
  const runOnceAnimationsFinish = useAnimationsFinished(positionerElement, false, false);
  const positioning = useAnchorPositioning({
    anchor,
    floatingRootContext,
    positionMethod,
    mounted,
    side,
    sideOffset,
    align,
    alignOffset,
    arrowPadding,
    collisionBoundary,
    collisionPadding,
    sticky,
    disableAnchorTracking,
    keepMounted,
    nodeId,
    collisionAvoidance,
    adaptiveOrigin: hasViewport ? adaptiveOrigin : void 0
  });
  const defaultProps = reactExports.useMemo(() => {
    const hiddenStyles = {};
    if (!open) {
      hiddenStyles.pointerEvents = "none";
    }
    return {
      role: "presentation",
      hidden: !mounted,
      style: {
        ...positioning.positionerStyles,
        ...hiddenStyles
      }
    };
  }, [open, mounted, positioning.positionerStyles]);
  const positioner = reactExports.useMemo(() => ({
    props: defaultProps,
    ...positioning
  }), [defaultProps, positioning]);
  const domReference = floatingRootContext?.select("domReferenceElement");
  useIsoLayoutEffect(() => {
    const currentTriggerElement = domReference;
    const prevTriggerElement = prevTriggerElementRef.current;
    if (currentTriggerElement) {
      prevTriggerElementRef.current = currentTriggerElement;
    }
    if (prevTriggerElement && currentTriggerElement && currentTriggerElement !== prevTriggerElement) {
      store.set("instantType", void 0);
      const ac = new AbortController();
      runOnceAnimationsFinish(() => {
        store.set("instantType", "trigger-change");
      }, ac.signal);
      return () => {
        ac.abort();
      };
    }
    return void 0;
  }, [domReference, runOnceAnimationsFinish, store]);
  const state = reactExports.useMemo(() => ({
    open,
    side: positioner.side,
    align: positioner.align,
    anchorHidden: positioner.anchorHidden,
    instant: instantType
  }), [open, positioner.side, positioner.align, positioner.anchorHidden, instantType]);
  const setPositionerElement = reactExports.useCallback((element2) => {
    store.set("positionerElement", element2);
  }, [store]);
  const element = useRenderElement("div", componentProps, {
    state,
    props: [positioner.props, getDisabledMountTransitionStyles(transitionStatus), elementProps],
    ref: [forwardedRef, setPositionerElement],
    stateAttributesMapping: popupStateMapping
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverPositionerContext.Provider, {
    value: positioner,
    children: [mounted && modal === true && openReason !== triggerHover && /* @__PURE__ */ jsxRuntimeExports.jsx(InternalBackdrop, {
      ref: store.context.internalBackdropRef,
      inert: inertValue(!open),
      cutout: triggerElement
    }), /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingNode, {
      id: nodeId,
      children: element
    })]
  });
});
const ARROW_UP = "ArrowUp";
const ARROW_DOWN = "ArrowDown";
const ARROW_LEFT = "ArrowLeft";
const ARROW_RIGHT = "ArrowRight";
const HOME = "Home";
const END = "End";
const HORIZONTAL_KEYS = /* @__PURE__ */ new Set([ARROW_LEFT, ARROW_RIGHT]);
const VERTICAL_KEYS = /* @__PURE__ */ new Set([ARROW_UP, ARROW_DOWN]);
const ARROW_KEYS = /* @__PURE__ */ new Set([...HORIZONTAL_KEYS, ...VERTICAL_KEYS]);
/* @__PURE__ */ new Set([...ARROW_KEYS, HOME, END]);
const COMPOSITE_KEYS = /* @__PURE__ */ new Set([ARROW_UP, ARROW_DOWN, ARROW_LEFT, ARROW_RIGHT, HOME, END]);
const ToolbarRootContext = /* @__PURE__ */ reactExports.createContext(void 0);
function useToolbarRootContext(optional) {
  const context = reactExports.useContext(ToolbarRootContext);
  return context;
}
const stateAttributesMapping$5 = {
  ...popupStateMapping,
  ...transitionStatusMapping
};
const PopoverPopup = /* @__PURE__ */ reactExports.forwardRef(function PopoverPopup2(componentProps, forwardedRef) {
  const {
    className,
    render,
    initialFocus,
    finalFocus,
    ...elementProps
  } = componentProps;
  const {
    store
  } = usePopoverRootContext();
  const positioner = usePopoverPositionerContext();
  const insideToolbar = useToolbarRootContext() != null;
  const open = store.useState("open");
  const openMethod = store.useState("openMethod");
  const instantType = store.useState("instantType");
  const transitionStatus = store.useState("transitionStatus");
  const popupProps = store.useState("popupProps");
  const titleId = store.useState("titleElementId");
  const descriptionId = store.useState("descriptionElementId");
  const modal = store.useState("modal");
  const mounted = store.useState("mounted");
  const openReason = store.useState("openChangeReason");
  const activeTriggerElement = store.useState("activeTriggerElement");
  const floatingContext = store.useState("floatingRootContext");
  useOpenChangeComplete({
    open,
    ref: store.context.popupRef,
    onComplete() {
      if (open) {
        store.context.onOpenChangeComplete?.(true);
      }
    }
  });
  const disabled = store.useState("disabled");
  const openOnHover = store.useState("openOnHover");
  const closeDelay = store.useState("closeDelay");
  useHoverFloatingInteraction(floatingContext, {
    enabled: openOnHover && !disabled,
    closeDelay
  });
  function defaultInitialFocus(interactionType) {
    if (interactionType === "touch") {
      return store.context.popupRef.current;
    }
    return true;
  }
  const resolvedInitialFocus = initialFocus === void 0 ? defaultInitialFocus : initialFocus;
  const state = reactExports.useMemo(() => ({
    open,
    side: positioner.side,
    align: positioner.align,
    instant: instantType,
    transitionStatus
  }), [open, positioner.side, positioner.align, instantType, transitionStatus]);
  const setPopupElement = reactExports.useCallback((element2) => {
    store.set("popupElement", element2);
  }, [store]);
  const element = useRenderElement("div", componentProps, {
    state,
    ref: [forwardedRef, store.context.popupRef, setPopupElement],
    props: [popupProps, {
      "aria-labelledby": titleId,
      "aria-describedby": descriptionId,
      onKeyDown(event) {
        if (insideToolbar && COMPOSITE_KEYS.has(event.key)) {
          event.stopPropagation();
        }
      }
    }, getDisabledMountTransitionStyles(transitionStatus), elementProps],
    stateAttributesMapping: stateAttributesMapping$5
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingFocusManager, {
    context: floatingContext,
    openInteractionType: openMethod,
    modal: modal === "trap-focus",
    disabled: !mounted || openReason === triggerHover,
    initialFocus: resolvedInitialFocus,
    returnFocus: finalFocus,
    restoreFocus: "popup",
    previousFocusableElement: isHTMLElement(activeTriggerElement) ? activeTriggerElement : void 0,
    nextFocusableElement: store.context.triggerFocusTargetRef,
    beforeContentFocusGuardRef: store.context.beforeContentFocusGuardRef,
    children: element
  });
});
function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height
  };
}
const supportsResizeObserver = typeof ResizeObserver !== "undefined";
const DEFAULT_ENABLED = () => true;
function usePopupAutoResize(parameters) {
  const {
    popupElement,
    positionerElement,
    content,
    mounted,
    enabled = DEFAULT_ENABLED,
    onMeasureLayout: onMeasureLayoutParam,
    onMeasureLayoutComplete: onMeasureLayoutCompleteParam,
    side,
    direction
  } = parameters;
  const runOnceAnimationsFinish = useAnimationsFinished(popupElement, true, false);
  const animationFrame = useAnimationFrame();
  const committedDimensionsRef = reactExports.useRef(null);
  const liveDimensionsRef = reactExports.useRef(null);
  const isInitialRenderRef = reactExports.useRef(true);
  const restoreAnchoringStylesRef = reactExports.useRef(NOOP);
  const onMeasureLayout = useStableCallback(onMeasureLayoutParam);
  const onMeasureLayoutComplete = useStableCallback(onMeasureLayoutCompleteParam);
  const anchoringStyles = reactExports.useMemo(() => {
    let isOriginSide = side === "top";
    let isPhysicalLeft = side === "left";
    if (direction === "rtl") {
      isOriginSide = isOriginSide || side === "inline-end";
      isPhysicalLeft = isPhysicalLeft || side === "inline-end";
    } else {
      isOriginSide = isOriginSide || side === "inline-start";
      isPhysicalLeft = isPhysicalLeft || side === "inline-start";
    }
    return isOriginSide ? {
      position: "absolute",
      [side === "top" ? "bottom" : "top"]: "0",
      [isPhysicalLeft ? "right" : "left"]: "0"
    } : EMPTY_OBJECT;
  }, [side, direction]);
  useIsoLayoutEffect(() => {
    if (!mounted || !enabled() || !supportsResizeObserver) {
      restoreAnchoringStylesRef.current = NOOP;
      isInitialRenderRef.current = true;
      committedDimensionsRef.current = null;
      liveDimensionsRef.current = null;
      return void 0;
    }
    if (!popupElement || !positionerElement) {
      return void 0;
    }
    restoreAnchoringStylesRef.current = applyElementStyles(popupElement, anchoringStyles);
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        liveDimensionsRef.current = {
          width: Math.ceil(entry.borderBoxSize[0].inlineSize),
          height: Math.ceil(entry.borderBoxSize[0].blockSize)
        };
      }
    });
    observer.observe(popupElement);
    setPopupCssSize(popupElement, "auto");
    const restorePopupPosition = overrideElementStyle(popupElement, "position", "static");
    const restorePopupTransform = overrideElementStyle(popupElement, "transform", "none");
    const restorePopupScale = overrideElementStyle(popupElement, "scale", "1");
    const restorePositionerAvailableSize = applyElementStyles(positionerElement, {
      "--available-width": "max-content",
      "--available-height": "max-content"
    });
    function restoreMeasurementOverrides() {
      restorePopupPosition();
      restorePopupTransform();
      restorePositionerAvailableSize();
    }
    function restoreMeasurementOverridesIncludingScale() {
      restoreMeasurementOverrides();
      restorePopupScale();
    }
    onMeasureLayout?.();
    if (isInitialRenderRef.current || committedDimensionsRef.current === null) {
      setPositionerCssSize(positionerElement, "max-content");
      const dimensions = getCssDimensions(popupElement);
      committedDimensionsRef.current = dimensions;
      setPositionerCssSize(positionerElement, dimensions);
      restoreMeasurementOverridesIncludingScale();
      onMeasureLayoutComplete?.(null, dimensions);
      isInitialRenderRef.current = false;
      return () => {
        observer.disconnect();
        restoreAnchoringStylesRef.current();
        restoreAnchoringStylesRef.current = NOOP;
      };
    }
    setPopupCssSize(popupElement, "auto");
    setPositionerCssSize(positionerElement, "max-content");
    const previousDimensions = committedDimensionsRef.current ?? liveDimensionsRef.current;
    const newDimensions = getCssDimensions(popupElement);
    committedDimensionsRef.current = newDimensions;
    if (!previousDimensions) {
      setPositionerCssSize(positionerElement, newDimensions);
      restoreMeasurementOverridesIncludingScale();
      onMeasureLayoutComplete?.(null, newDimensions);
      return () => {
        observer.disconnect();
        animationFrame.cancel();
        restoreAnchoringStylesRef.current();
        restoreAnchoringStylesRef.current = NOOP;
      };
    }
    setPopupCssSize(popupElement, previousDimensions);
    restoreMeasurementOverrides();
    onMeasureLayoutComplete?.(previousDimensions, newDimensions);
    setPositionerCssSize(positionerElement, newDimensions);
    const abortController = new AbortController();
    animationFrame.request(() => {
      setPopupCssSize(popupElement, newDimensions);
      runOnceAnimationsFinish(() => {
        popupElement.style.setProperty("--popup-width", "auto");
        popupElement.style.setProperty("--popup-height", "auto");
      }, abortController.signal);
    });
    return () => {
      observer.disconnect();
      abortController.abort();
      animationFrame.cancel();
      restoreAnchoringStylesRef.current();
      restoreAnchoringStylesRef.current = NOOP;
    };
  }, [content, popupElement, positionerElement, runOnceAnimationsFinish, animationFrame, enabled, mounted, onMeasureLayout, onMeasureLayoutComplete, anchoringStyles]);
}
function overrideElementStyle(element, property, value) {
  const originalValue = element.style.getPropertyValue(property);
  element.style.setProperty(property, value);
  return () => {
    element.style.setProperty(property, originalValue);
  };
}
function applyElementStyles(element, styles) {
  const restorers = [];
  for (const [key, value] of Object.entries(styles)) {
    restorers.push(overrideElementStyle(element, key, value));
  }
  return restorers.length ? () => {
    restorers.forEach((restore) => restore());
  } : NOOP;
}
function setPopupCssSize(popupElement, size2) {
  const width = size2 === "auto" ? "auto" : `${size2.width}px`;
  const height = size2 === "auto" ? "auto" : `${size2.height}px`;
  popupElement.style.setProperty("--popup-width", width);
  popupElement.style.setProperty("--popup-height", height);
}
function setPositionerCssSize(positionerElement, size2) {
  const width = size2 === "max-content" ? "max-content" : `${size2.width}px`;
  const height = size2 === "max-content" ? "max-content" : `${size2.height}px`;
  positionerElement.style.setProperty("--positioner-width", width);
  positionerElement.style.setProperty("--positioner-height", height);
}
let PopoverViewportCssVars = /* @__PURE__ */ (function(PopoverViewportCssVars2) {
  PopoverViewportCssVars2["popupWidth"] = "--popup-width";
  PopoverViewportCssVars2["popupHeight"] = "--popup-height";
  return PopoverViewportCssVars2;
})({});
const stateAttributesMapping$4 = {
  activationDirection: (value) => value ? {
    "data-activation-direction": value
  } : null
};
const PopoverViewport = /* @__PURE__ */ reactExports.forwardRef(function PopoverViewport2(componentProps, forwardedRef) {
  const {
    render,
    className,
    children,
    ...elementProps
  } = componentProps;
  const {
    store
  } = usePopoverRootContext();
  const positioner = usePopoverPositionerContext();
  const direction = useDirection();
  const activeTrigger = store.useState("activeTriggerElement");
  const open = store.useState("open");
  const mounted = store.useState("mounted");
  const payload = store.useState("payload");
  const popupElement = store.useState("popupElement");
  const positionerElement = store.useState("positionerElement");
  const previousActiveTrigger = usePreviousValue(open ? activeTrigger : null);
  const capturedNodeRef = reactExports.useRef(null);
  const [previousContentNode, setPreviousContentNode] = reactExports.useState(null);
  const [newTriggerOffset, setNewTriggerOffset] = reactExports.useState(null);
  const currentContainerRef = reactExports.useRef(null);
  const previousContainerRef = reactExports.useRef(null);
  const onAnimationsFinished = useAnimationsFinished(currentContainerRef, true, false);
  const cleanupFrame = useAnimationFrame();
  const [previousContentDimensions, setPreviousContentDimensions] = reactExports.useState(null);
  const [showStartingStyleAttribute, setShowStartingStyleAttribute] = reactExports.useState(false);
  useIsoLayoutEffect(() => {
    store.set("hasViewport", true);
    return () => {
      store.set("hasViewport", false);
    };
  }, [store]);
  useIsoLayoutEffect(() => {
    const source = currentContainerRef.current;
    if (!source) {
      return;
    }
    const wrapper = document.createElement("div");
    for (const child of Array.from(source.childNodes)) {
      wrapper.appendChild(child.cloneNode(true));
    }
    capturedNodeRef.current = wrapper;
  });
  const handleMeasureLayout = useStableCallback(() => {
    currentContainerRef.current?.style.setProperty("animation", "none");
    currentContainerRef.current?.style.setProperty("transition", "none");
    previousContainerRef.current?.style.setProperty("display", "none");
  });
  const handleMeasureLayoutComplete = useStableCallback((previousDimensions) => {
    currentContainerRef.current?.style.removeProperty("animation");
    currentContainerRef.current?.style.removeProperty("transition");
    previousContainerRef.current?.style.removeProperty("display");
    if (previousDimensions) {
      setPreviousContentDimensions(previousDimensions);
    }
  });
  const lastHandledTriggerRef = reactExports.useRef(null);
  useIsoLayoutEffect(() => {
    if (activeTrigger && previousActiveTrigger && activeTrigger !== previousActiveTrigger && lastHandledTriggerRef.current !== activeTrigger && capturedNodeRef.current) {
      setPreviousContentNode(capturedNodeRef.current);
      setShowStartingStyleAttribute(true);
      const offset2 = calculateRelativePosition(previousActiveTrigger, activeTrigger);
      setNewTriggerOffset(offset2);
      cleanupFrame.request(() => {
        cleanupFrame.request(() => {
          setShowStartingStyleAttribute(false);
          onAnimationsFinished(() => {
            setPreviousContentNode(null);
            setPreviousContentDimensions(null);
            capturedNodeRef.current = null;
          });
        });
      });
      lastHandledTriggerRef.current = activeTrigger;
    }
  }, [activeTrigger, previousActiveTrigger, previousContentNode, onAnimationsFinished, cleanupFrame]);
  const isTransitioning = previousContentNode != null;
  let childrenToRender;
  if (!isTransitioning) {
    childrenToRender = /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      "data-current": true,
      ref: currentContainerRef,
      children
    }, "current");
  } else {
    childrenToRender = /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, {
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        "data-previous": true,
        inert: inertValue(true),
        ref: previousContainerRef,
        style: {
          [PopoverViewportCssVars.popupWidth]: `${previousContentDimensions?.width}px`,
          [PopoverViewportCssVars.popupHeight]: `${previousContentDimensions?.height}px`,
          position: "absolute"
        },
        "data-ending-style": showStartingStyleAttribute ? void 0 : ""
      }, "previous"), /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        "data-current": true,
        ref: currentContainerRef,
        "data-starting-style": showStartingStyleAttribute ? "" : void 0,
        children
      }, "current")]
    });
  }
  useIsoLayoutEffect(() => {
    const container = previousContainerRef.current;
    if (!container || !previousContentNode) {
      return;
    }
    container.replaceChildren(...Array.from(previousContentNode.childNodes));
  }, [previousContentNode]);
  usePopupAutoResize({
    popupElement,
    positionerElement,
    mounted,
    content: payload,
    onMeasureLayout: handleMeasureLayout,
    onMeasureLayoutComplete: handleMeasureLayoutComplete,
    side: positioner.side,
    direction
  });
  const state = reactExports.useMemo(() => {
    return {
      activationDirection: getActivationDirection(newTriggerOffset),
      transitioning: isTransitioning
    };
  }, [newTriggerOffset, isTransitioning]);
  return useRenderElement("div", componentProps, {
    state,
    ref: forwardedRef,
    props: [elementProps, {
      children: childrenToRender
    }],
    stateAttributesMapping: stateAttributesMapping$4
  });
});
function getActivationDirection(offset2) {
  if (!offset2) {
    return void 0;
  }
  return `${getValueWithTolerance(offset2.horizontal, 5, "right", "left")} ${getValueWithTolerance(offset2.vertical, 5, "down", "up")}`;
}
function getValueWithTolerance(value, tolerance, positiveLabel, negativeLabel) {
  if (value > tolerance) {
    return positiveLabel;
  }
  if (value < -tolerance) {
    return negativeLabel;
  }
  return "";
}
function calculateRelativePosition(from, to) {
  const fromRect = from.getBoundingClientRect();
  const toRect = to.getBoundingClientRect();
  const fromCenter = {
    x: fromRect.left + fromRect.width / 2,
    y: fromRect.top + fromRect.height / 2
  };
  const toCenter = {
    x: toRect.left + toRect.width / 2,
    y: toRect.top + toRect.height / 2
  };
  return {
    horizontal: toCenter.x - fromCenter.x,
    vertical: toCenter.y - fromCenter.y
  };
}
function useDialogRoot(params) {
  const {
    store,
    parentContext,
    actionsRef
  } = params;
  const open = store.useState("open");
  const disablePointerDismissal = store.useState("disablePointerDismissal");
  const modal = store.useState("modal");
  const popupElement = store.useState("popupElement");
  const {
    openMethod,
    triggerProps,
    reset: resetOpenInteractionType
  } = useOpenInteractionType(open);
  useImplicitActiveTrigger(store);
  const {
    forceUnmount
  } = useOpenStateTransitions(open, store, () => {
    resetOpenInteractionType();
  });
  const createDialogEventDetails = useStableCallback((reason) => {
    const details = createChangeEventDetails(reason);
    details.preventUnmountOnClose = () => {
      store.set("preventUnmountingOnClose", true);
    };
    return details;
  });
  const handleImperativeClose = reactExports.useCallback(() => {
    store.setOpen(false, createDialogEventDetails(imperativeAction));
  }, [store, createDialogEventDetails]);
  reactExports.useImperativeHandle(actionsRef, () => ({
    unmount: forceUnmount,
    close: handleImperativeClose
  }), [forceUnmount, handleImperativeClose]);
  const floatingRootContext = useSyncedFloatingRootContext({
    popupStore: store,
    onOpenChange: store.setOpen,
    treatPopupAsFloatingElement: true,
    noEmit: true
  });
  const [ownNestedOpenDialogs, setOwnNestedOpenDialogs] = reactExports.useState(0);
  const isTopmost = ownNestedOpenDialogs === 0;
  const role = useRole(floatingRootContext);
  const dismiss = useDismiss(floatingRootContext, {
    outsidePressEvent() {
      if (store.context.internalBackdropRef.current || store.context.backdropRef.current) {
        return "intentional";
      }
      return {
        mouse: modal === "trap-focus" ? "sloppy" : "intentional",
        touch: "sloppy"
      };
    },
    outsidePress(event) {
      if ("button" in event && event.button !== 0) {
        return false;
      }
      if ("touches" in event && event.touches.length !== 1) {
        return false;
      }
      const target = getTarget(event);
      if (isTopmost && !disablePointerDismissal) {
        const eventTarget = target;
        if (modal) {
          return store.context.internalBackdropRef.current || store.context.backdropRef.current ? store.context.internalBackdropRef.current === eventTarget || store.context.backdropRef.current === eventTarget || contains(eventTarget, popupElement) && !eventTarget?.hasAttribute("data-base-ui-portal") : true;
        }
        return true;
      }
      return false;
    },
    escapeKey: isTopmost
  });
  useScrollLock(open && modal === true, popupElement);
  const {
    getReferenceProps,
    getFloatingProps,
    getTriggerProps
  } = useInteractions([role, dismiss]);
  store.useContextCallback("onNestedDialogOpen", (ownChildrenCount) => {
    setOwnNestedOpenDialogs(ownChildrenCount + 1);
  });
  store.useContextCallback("onNestedDialogClose", () => {
    setOwnNestedOpenDialogs(0);
  });
  reactExports.useEffect(() => {
    if (parentContext?.onNestedDialogOpen && open) {
      parentContext.onNestedDialogOpen(ownNestedOpenDialogs);
    }
    if (parentContext?.onNestedDialogClose && !open) {
      parentContext.onNestedDialogClose();
    }
    return () => {
      if (parentContext?.onNestedDialogClose && open) {
        parentContext.onNestedDialogClose();
      }
    };
  }, [open, parentContext, ownNestedOpenDialogs]);
  const activeTriggerProps = reactExports.useMemo(() => getReferenceProps(triggerProps), [getReferenceProps, triggerProps]);
  const inactiveTriggerProps = reactExports.useMemo(() => getTriggerProps(triggerProps), [getTriggerProps, triggerProps]);
  const popupProps = reactExports.useMemo(() => getFloatingProps(), [getFloatingProps]);
  store.useSyncedValues({
    openMethod,
    activeTriggerProps,
    inactiveTriggerProps,
    popupProps,
    floatingRootContext,
    nestedOpenDialogCount: ownNestedOpenDialogs
  });
}
const DialogRootContext = /* @__PURE__ */ reactExports.createContext(void 0);
function useDialogRootContext(optional) {
  const dialogRootContext = reactExports.useContext(DialogRootContext);
  return dialogRootContext;
}
const selectors$1 = {
  ...popupStoreSelectors,
  modal: createSelector((state) => state.modal),
  nested: createSelector((state) => state.nested),
  nestedOpenDialogCount: createSelector((state) => state.nestedOpenDialogCount),
  disablePointerDismissal: createSelector((state) => state.disablePointerDismissal),
  openMethod: createSelector((state) => state.openMethod),
  descriptionElementId: createSelector((state) => state.descriptionElementId),
  titleElementId: createSelector((state) => state.titleElementId),
  viewportElement: createSelector((state) => state.viewportElement),
  role: createSelector((state) => state.role)
};
class DialogStore extends ReactStore {
  constructor(initialState) {
    super(createInitialState$1(initialState), {
      popupRef: /* @__PURE__ */ reactExports.createRef(),
      backdropRef: /* @__PURE__ */ reactExports.createRef(),
      internalBackdropRef: /* @__PURE__ */ reactExports.createRef(),
      triggerElements: new PopupTriggerMap(),
      onOpenChange: void 0,
      onOpenChangeComplete: void 0
    }, selectors$1);
  }
  setOpen = (nextOpen, eventDetails) => {
    eventDetails.preventUnmountOnClose = () => {
      this.set("preventUnmountingOnClose", true);
    };
    if (!nextOpen && eventDetails.trigger == null && this.state.activeTriggerId != null) {
      eventDetails.trigger = this.state.activeTriggerElement ?? void 0;
    }
    this.context.onOpenChange?.(nextOpen, eventDetails);
    if (eventDetails.isCanceled) {
      return;
    }
    const details = {
      open: nextOpen,
      nativeEvent: eventDetails.event,
      reason: eventDetails.reason,
      nested: this.state.nested
    };
    this.state.floatingRootContext.context.events?.emit("openchange", details);
    const updatedState = {
      open: nextOpen
    };
    const newTriggerId = eventDetails.trigger?.id ?? null;
    if (newTriggerId || nextOpen) {
      updatedState.activeTriggerId = newTriggerId;
      updatedState.activeTriggerElement = eventDetails.trigger ?? null;
    }
    this.update(updatedState);
  };
}
function createInitialState$1(initialState = {}) {
  return {
    ...createInitialPopupStoreState(),
    modal: true,
    disablePointerDismissal: false,
    popupElement: null,
    viewportElement: null,
    descriptionElementId: void 0,
    titleElementId: void 0,
    openMethod: null,
    nested: false,
    nestedOpenDialogCount: 0,
    role: "dialog",
    ...initialState
  };
}
function AlertDialogRoot(props) {
  const {
    children,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    onOpenChangeComplete,
    actionsRef,
    handle,
    triggerId: triggerIdProp,
    defaultTriggerId: defaultTriggerIdProp = null
  } = props;
  const parentDialogRootContext = useDialogRootContext();
  const nested = Boolean(parentDialogRootContext);
  const store = useRefWithInit(() => {
    return handle?.store ?? new DialogStore({
      open: openProp ?? defaultOpen,
      activeTriggerId: triggerIdProp !== void 0 ? triggerIdProp : defaultTriggerIdProp,
      modal: true,
      disablePointerDismissal: true,
      nested,
      role: "alertdialog"
    });
  }).current;
  store.useControlledProp("open", openProp, defaultOpen);
  store.useControlledProp("activeTriggerId", triggerIdProp, defaultTriggerIdProp);
  store.useSyncedValue("nested", nested);
  store.useContextCallback("onOpenChange", onOpenChange);
  store.useContextCallback("onOpenChangeComplete", onOpenChangeComplete);
  const payload = store.useState("payload");
  useDialogRoot({
    store,
    actionsRef,
    parentContext: parentDialogRootContext?.store.context
  });
  const contextValue = reactExports.useMemo(() => ({
    store
  }), [store]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogRootContext.Provider, {
    value: contextValue,
    children: typeof children === "function" ? children({
      payload
    }) : children
  });
}
const stateAttributesMapping$3 = {
  ...popupStateMapping,
  ...transitionStatusMapping
};
const DialogBackdrop = /* @__PURE__ */ reactExports.forwardRef(function DialogBackdrop2(componentProps, forwardedRef) {
  const {
    render,
    className,
    forceRender = false,
    ...elementProps
  } = componentProps;
  const {
    store
  } = useDialogRootContext();
  const open = store.useState("open");
  const nested = store.useState("nested");
  const mounted = store.useState("mounted");
  const transitionStatus = store.useState("transitionStatus");
  const state = reactExports.useMemo(() => ({
    open,
    transitionStatus
  }), [open, transitionStatus]);
  return useRenderElement("div", componentProps, {
    state,
    ref: [store.context.backdropRef, forwardedRef],
    stateAttributesMapping: stateAttributesMapping$3,
    props: [{
      role: "presentation",
      hidden: !mounted,
      style: {
        userSelect: "none",
        WebkitUserSelect: "none"
      }
    }, elementProps],
    enabled: forceRender || !nested
  });
});
const DialogClose = /* @__PURE__ */ reactExports.forwardRef(function DialogClose2(componentProps, forwardedRef) {
  const {
    render,
    className,
    disabled = false,
    nativeButton = true,
    ...elementProps
  } = componentProps;
  const {
    store
  } = useDialogRootContext();
  const open = store.useState("open");
  function handleClick(event) {
    if (open) {
      store.setOpen(false, createChangeEventDetails(closePress, event.nativeEvent));
    }
  }
  const {
    getButtonProps,
    buttonRef
  } = useButton({
    disabled,
    native: nativeButton
  });
  const state = reactExports.useMemo(() => ({
    disabled
  }), [disabled]);
  return useRenderElement("button", componentProps, {
    state,
    ref: [forwardedRef, buttonRef],
    props: [{
      onClick: handleClick
    }, elementProps, getButtonProps]
  });
});
const DialogDescription = /* @__PURE__ */ reactExports.forwardRef(function DialogDescription2(componentProps, forwardedRef) {
  const {
    render,
    className,
    id: idProp,
    ...elementProps
  } = componentProps;
  const {
    store
  } = useDialogRootContext();
  const id = useBaseUiId(idProp);
  store.useSyncedValueWithCleanup("descriptionElementId", id);
  return useRenderElement("p", componentProps, {
    ref: forwardedRef,
    props: [{
      id
    }, elementProps]
  });
});
let DialogPopupCssVars = /* @__PURE__ */ (function(DialogPopupCssVars2) {
  DialogPopupCssVars2["nestedDialogs"] = "--nested-dialogs";
  return DialogPopupCssVars2;
})({});
let DialogPopupDataAttributes = (function(DialogPopupDataAttributes2) {
  DialogPopupDataAttributes2[DialogPopupDataAttributes2["open"] = CommonPopupDataAttributes.open] = "open";
  DialogPopupDataAttributes2[DialogPopupDataAttributes2["closed"] = CommonPopupDataAttributes.closed] = "closed";
  DialogPopupDataAttributes2[DialogPopupDataAttributes2["startingStyle"] = CommonPopupDataAttributes.startingStyle] = "startingStyle";
  DialogPopupDataAttributes2[DialogPopupDataAttributes2["endingStyle"] = CommonPopupDataAttributes.endingStyle] = "endingStyle";
  DialogPopupDataAttributes2["nested"] = "data-nested";
  DialogPopupDataAttributes2["nestedDialogOpen"] = "data-nested-dialog-open";
  return DialogPopupDataAttributes2;
})({});
const DialogPortalContext = /* @__PURE__ */ reactExports.createContext(void 0);
function useDialogPortalContext() {
  const value = reactExports.useContext(DialogPortalContext);
  if (value === void 0) {
    throw new Error(formatErrorMessage(26));
  }
  return value;
}
const stateAttributesMapping$2 = {
  ...popupStateMapping,
  ...transitionStatusMapping,
  nestedDialogOpen(value) {
    return value ? {
      [DialogPopupDataAttributes.nestedDialogOpen]: ""
    } : null;
  }
};
const DialogPopup = /* @__PURE__ */ reactExports.forwardRef(function DialogPopup2(componentProps, forwardedRef) {
  const {
    className,
    finalFocus,
    initialFocus,
    render,
    ...elementProps
  } = componentProps;
  const {
    store
  } = useDialogRootContext();
  const descriptionElementId = store.useState("descriptionElementId");
  const disablePointerDismissal = store.useState("disablePointerDismissal");
  const floatingRootContext = store.useState("floatingRootContext");
  const rootPopupProps = store.useState("popupProps");
  const modal = store.useState("modal");
  const mounted = store.useState("mounted");
  const nested = store.useState("nested");
  const nestedOpenDialogCount = store.useState("nestedOpenDialogCount");
  const open = store.useState("open");
  const openMethod = store.useState("openMethod");
  const titleElementId = store.useState("titleElementId");
  const transitionStatus = store.useState("transitionStatus");
  const role = store.useState("role");
  useDialogPortalContext();
  useOpenChangeComplete({
    open,
    ref: store.context.popupRef,
    onComplete() {
      if (open) {
        store.context.onOpenChangeComplete?.(true);
      }
    }
  });
  function defaultInitialFocus(interactionType) {
    if (interactionType === "touch") {
      return store.context.popupRef.current;
    }
    return true;
  }
  const resolvedInitialFocus = initialFocus === void 0 ? defaultInitialFocus : initialFocus;
  const nestedDialogOpen = nestedOpenDialogCount > 0;
  const state = reactExports.useMemo(() => ({
    open,
    nested,
    transitionStatus,
    nestedDialogOpen
  }), [open, nested, transitionStatus, nestedDialogOpen]);
  const element = useRenderElement("div", componentProps, {
    state,
    props: [rootPopupProps, {
      "aria-labelledby": titleElementId ?? void 0,
      "aria-describedby": descriptionElementId ?? void 0,
      role,
      tabIndex: -1,
      hidden: !mounted,
      onKeyDown(event) {
        if (COMPOSITE_KEYS.has(event.key)) {
          event.stopPropagation();
        }
      },
      style: {
        [DialogPopupCssVars.nestedDialogs]: nestedOpenDialogCount
      }
    }, elementProps],
    ref: [forwardedRef, store.context.popupRef, store.useStateSetter("popupElement")],
    stateAttributesMapping: stateAttributesMapping$2
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingFocusManager, {
    context: floatingRootContext,
    openInteractionType: openMethod,
    disabled: !mounted,
    closeOnFocusOut: !disablePointerDismissal,
    initialFocus: resolvedInitialFocus,
    returnFocus: finalFocus,
    modal: modal !== false,
    restoreFocus: "popup",
    children: element
  });
});
const DialogPortal = /* @__PURE__ */ reactExports.forwardRef(function DialogPortal2(props, forwardedRef) {
  const {
    keepMounted = false,
    ...portalProps
  } = props;
  const {
    store
  } = useDialogRootContext();
  const mounted = store.useState("mounted");
  const modal = store.useState("modal");
  const open = store.useState("open");
  const shouldRender = mounted || keepMounted;
  if (!shouldRender) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogPortalContext.Provider, {
    value: keepMounted,
    children: /* @__PURE__ */ jsxRuntimeExports.jsxs(FloatingPortal, {
      ref: forwardedRef,
      ...portalProps,
      children: [mounted && modal === true && /* @__PURE__ */ jsxRuntimeExports.jsx(InternalBackdrop, {
        ref: store.context.internalBackdropRef,
        inert: inertValue(!open)
      }), props.children]
    })
  });
});
const DialogTitle = /* @__PURE__ */ reactExports.forwardRef(function DialogTitle2(componentProps, forwardedRef) {
  const {
    render,
    className,
    id: idProp,
    ...elementProps
  } = componentProps;
  const {
    store
  } = useDialogRootContext();
  const id = useBaseUiId(idProp);
  store.useSyncedValueWithCleanup("titleElementId", id);
  return useRenderElement("h2", componentProps, {
    ref: forwardedRef,
    props: [{
      id
    }, elementProps]
  });
});
let DialogViewportDataAttributes = (function(DialogViewportDataAttributes2) {
  DialogViewportDataAttributes2[DialogViewportDataAttributes2["open"] = CommonPopupDataAttributes.open] = "open";
  DialogViewportDataAttributes2[DialogViewportDataAttributes2["closed"] = CommonPopupDataAttributes.closed] = "closed";
  DialogViewportDataAttributes2[DialogViewportDataAttributes2["startingStyle"] = CommonPopupDataAttributes.startingStyle] = "startingStyle";
  DialogViewportDataAttributes2[DialogViewportDataAttributes2["endingStyle"] = CommonPopupDataAttributes.endingStyle] = "endingStyle";
  DialogViewportDataAttributes2["nested"] = "data-nested";
  DialogViewportDataAttributes2["nestedDialogOpen"] = "data-nested-dialog-open";
  return DialogViewportDataAttributes2;
})({});
const stateAttributesMapping$1 = {
  ...popupStateMapping,
  ...transitionStatusMapping,
  nested(value) {
    return value ? {
      [DialogViewportDataAttributes.nested]: ""
    } : null;
  },
  nestedDialogOpen(value) {
    return value ? {
      [DialogViewportDataAttributes.nestedDialogOpen]: ""
    } : null;
  }
};
const DialogViewport = /* @__PURE__ */ reactExports.forwardRef(function DialogViewport2(componentProps, forwardedRef) {
  const {
    className,
    render,
    children,
    ...elementProps
  } = componentProps;
  const keepMounted = useDialogPortalContext();
  const {
    store
  } = useDialogRootContext();
  const open = store.useState("open");
  const nested = store.useState("nested");
  const transitionStatus = store.useState("transitionStatus");
  const nestedOpenDialogCount = store.useState("nestedOpenDialogCount");
  const mounted = store.useState("mounted");
  const nestedDialogOpen = nestedOpenDialogCount > 0;
  const state = reactExports.useMemo(() => ({
    open,
    nested,
    transitionStatus,
    nestedDialogOpen
  }), [open, nested, transitionStatus, nestedDialogOpen]);
  const shouldRender = keepMounted || mounted;
  return useRenderElement("div", componentProps, {
    enabled: shouldRender,
    state,
    ref: [forwardedRef, store.useStateSetter("viewportElement")],
    stateAttributesMapping: stateAttributesMapping$1,
    props: [{
      role: "presentation",
      hidden: !mounted,
      children
    }, elementProps]
  });
});
const MenuPositionerContext = /* @__PURE__ */ reactExports.createContext(void 0);
function useMenuPositionerContext(optional) {
  const context = reactExports.useContext(MenuPositionerContext);
  if (context === void 0 && !optional) {
    throw new Error(formatErrorMessage(33));
  }
  return context;
}
const MenuRootContext = /* @__PURE__ */ reactExports.createContext(void 0);
function useMenuRootContext(optional) {
  const context = reactExports.useContext(MenuRootContext);
  if (context === void 0 && !optional) {
    throw new Error(formatErrorMessage(36));
  }
  return context;
}
const ContextMenuRootContext = /* @__PURE__ */ reactExports.createContext(void 0);
function useContextMenuRootContext(optional = true) {
  const context = reactExports.useContext(ContextMenuRootContext);
  if (context === void 0 && !optional) {
    throw new Error(formatErrorMessage(25));
  }
  return context;
}
const REGULAR_ITEM = {
  type: "regular-item"
};
function useMenuItem(params) {
  const {
    closeOnClick,
    disabled = false,
    highlighted,
    id,
    store,
    nativeButton,
    itemMetadata,
    nodeId
  } = params;
  const itemRef = reactExports.useRef(null);
  const contextMenuContext = useContextMenuRootContext(true);
  const isContextMenu = contextMenuContext !== void 0;
  const {
    events: menuEvents
  } = store.useState("floatingTreeRoot");
  const {
    getButtonProps,
    buttonRef
  } = useButton({
    disabled,
    focusableWhenDisabled: true,
    native: nativeButton
  });
  const getItemProps = reactExports.useCallback((externalProps) => {
    return mergeProps$1({
      id,
      role: "menuitem",
      tabIndex: highlighted ? 0 : -1,
      onMouseMove(event) {
        if (!nodeId) {
          return;
        }
        menuEvents.emit("itemhover", {
          nodeId,
          target: event.currentTarget
        });
      },
      onMouseEnter() {
        if (itemMetadata.type !== "submenu-trigger") {
          return;
        }
        itemMetadata.setActive();
      },
      onKeyUp(event) {
        if (event.key === " " && store.context.typingRef.current) {
          event.preventBaseUIHandler();
        }
      },
      onClick(event) {
        if (closeOnClick) {
          menuEvents.emit("close", {
            domEvent: event,
            reason: itemPress
          });
        }
      },
      onMouseUp(event) {
        if (contextMenuContext) {
          const initialCursorPoint = contextMenuContext.initialCursorPointRef.current;
          contextMenuContext.initialCursorPointRef.current = null;
          if (isContextMenu && initialCursorPoint && Math.abs(event.clientX - initialCursorPoint.x) <= 1 && Math.abs(event.clientY - initialCursorPoint.y) <= 1) {
            return;
          }
        }
        if (itemRef.current && store.context.allowMouseUpTriggerRef.current && (!isContextMenu || event.button === 2)) {
          if (itemMetadata.type === "regular-item") {
            itemRef.current.click();
          }
        }
      }
    }, externalProps, getButtonProps);
  }, [id, highlighted, getButtonProps, closeOnClick, menuEvents, store, isContextMenu, contextMenuContext, itemMetadata, nodeId]);
  const mergedRef = useMergedRefs(itemRef, buttonRef);
  return reactExports.useMemo(() => ({
    getItemProps,
    itemRef: mergedRef
  }), [getItemProps, mergedRef]);
}
const CompositeListContext = /* @__PURE__ */ reactExports.createContext({
  register: () => {
  },
  unregister: () => {
  },
  subscribeMapChange: () => {
    return () => {
    };
  },
  elementsRef: {
    current: []
  },
  nextIndexRef: {
    current: 0
  }
});
function useCompositeListContext() {
  return reactExports.useContext(CompositeListContext);
}
let IndexGuessBehavior = /* @__PURE__ */ (function(IndexGuessBehavior2) {
  IndexGuessBehavior2[IndexGuessBehavior2["None"] = 0] = "None";
  IndexGuessBehavior2[IndexGuessBehavior2["GuessFromOrder"] = 1] = "GuessFromOrder";
  return IndexGuessBehavior2;
})({});
function useCompositeListItem(params = {}) {
  const {
    label,
    metadata,
    textRef,
    indexGuessBehavior,
    index: externalIndex
  } = params;
  const {
    register,
    unregister,
    subscribeMapChange,
    elementsRef,
    labelsRef,
    nextIndexRef
  } = useCompositeListContext();
  const indexRef = reactExports.useRef(-1);
  const [index, setIndex] = reactExports.useState(externalIndex ?? (indexGuessBehavior === IndexGuessBehavior.GuessFromOrder ? () => {
    if (indexRef.current === -1) {
      const newIndex = nextIndexRef.current;
      nextIndexRef.current += 1;
      indexRef.current = newIndex;
    }
    return indexRef.current;
  } : -1));
  const componentRef = reactExports.useRef(null);
  const ref = reactExports.useCallback((node) => {
    componentRef.current = node;
    if (index !== -1 && node !== null) {
      elementsRef.current[index] = node;
      if (labelsRef) {
        const isLabelDefined = label !== void 0;
        labelsRef.current[index] = isLabelDefined ? label : textRef?.current?.textContent ?? node.textContent;
      }
    }
  }, [index, elementsRef, labelsRef, label, textRef]);
  useIsoLayoutEffect(() => {
    if (externalIndex != null) {
      return void 0;
    }
    const node = componentRef.current;
    if (node) {
      register(node, metadata);
      return () => {
        unregister(node);
      };
    }
    return void 0;
  }, [externalIndex, register, unregister, metadata]);
  useIsoLayoutEffect(() => {
    if (externalIndex != null) {
      return void 0;
    }
    return subscribeMapChange((map) => {
      const i = componentRef.current ? map.get(componentRef.current)?.index : null;
      if (i != null) {
        setIndex(i);
      }
    });
  }, [externalIndex, subscribeMapChange, setIndex]);
  return reactExports.useMemo(() => ({
    ref,
    index
  }), [index, ref]);
}
const MenuItem = /* @__PURE__ */ reactExports.forwardRef(function MenuItem2(componentProps, forwardedRef) {
  const {
    render,
    className,
    id: idProp,
    label,
    nativeButton = false,
    disabled = false,
    closeOnClick = true,
    ...elementProps
  } = componentProps;
  const listItem = useCompositeListItem({
    label
  });
  const menuPositionerContext = useMenuPositionerContext(true);
  const id = useBaseUiId(idProp);
  const {
    store
  } = useMenuRootContext();
  const highlighted = store.useState("isActive", listItem.index);
  const itemProps = store.useState("itemProps");
  const {
    getItemProps,
    itemRef
  } = useMenuItem({
    closeOnClick,
    disabled,
    highlighted,
    id,
    store,
    nativeButton,
    nodeId: menuPositionerContext?.nodeId,
    itemMetadata: REGULAR_ITEM
  });
  const state = reactExports.useMemo(() => ({
    disabled,
    highlighted
  }), [disabled, highlighted]);
  return useRenderElement("div", componentProps, {
    state,
    props: [itemProps, elementProps, getItemProps],
    ref: [itemRef, forwardedRef, listItem.ref]
  });
});
const stateAttributesMapping = {
  ...popupStateMapping,
  ...transitionStatusMapping
};
const MenuPopup = /* @__PURE__ */ reactExports.forwardRef(function MenuPopup2(componentProps, forwardedRef) {
  const {
    render,
    className,
    finalFocus,
    ...elementProps
  } = componentProps;
  const {
    store
  } = useMenuRootContext();
  const {
    side,
    align
  } = useMenuPositionerContext();
  const insideToolbar = useToolbarRootContext() != null;
  const open = store.useState("open");
  const transitionStatus = store.useState("transitionStatus");
  const popupProps = store.useState("popupProps");
  const mounted = store.useState("mounted");
  const instantType = store.useState("instantType");
  const triggerElement = store.useState("activeTriggerElement");
  const parent = store.useState("parent");
  const lastOpenChangeReason = store.useState("lastOpenChangeReason");
  const rootId = store.useState("rootId");
  const floatingContext = store.useState("floatingRootContext");
  const floatingTreeRoot = store.useState("floatingTreeRoot");
  const closeDelay = store.useState("closeDelay");
  const activeTriggerElement = store.useState("activeTriggerElement");
  const isContextMenu = parent.type === "context-menu";
  useOpenChangeComplete({
    open,
    ref: store.context.popupRef,
    onComplete() {
      if (open) {
        store.context.onOpenChangeComplete?.(true);
      }
    }
  });
  reactExports.useEffect(() => {
    function handleClose(event) {
      store.setOpen(false, createChangeEventDetails(event.reason, event.domEvent));
    }
    floatingTreeRoot.events.on("close", handleClose);
    return () => {
      floatingTreeRoot.events.off("close", handleClose);
    };
  }, [floatingTreeRoot.events, store]);
  const hoverEnabled = store.useState("hoverEnabled");
  const disabled = store.useState("disabled");
  useHoverFloatingInteraction(floatingContext, {
    enabled: hoverEnabled && !disabled && !isContextMenu && parent.type !== "menubar",
    closeDelay
  });
  const state = reactExports.useMemo(() => ({
    transitionStatus,
    side,
    align,
    open,
    nested: parent.type === "menu",
    instant: instantType
  }), [transitionStatus, side, align, open, parent.type, instantType]);
  const element = useRenderElement("div", componentProps, {
    state,
    ref: [forwardedRef, store.context.popupRef],
    stateAttributesMapping,
    props: [popupProps, {
      onKeyDown(event) {
        if (insideToolbar && COMPOSITE_KEYS.has(event.key)) {
          event.stopPropagation();
        }
      }
    }, getDisabledMountTransitionStyles(transitionStatus), elementProps, {
      "data-rootownerid": rootId
    }]
  });
  let returnFocus = parent.type === void 0 || isContextMenu;
  if (triggerElement || parent.type === "menubar" && lastOpenChangeReason !== outsidePress) {
    returnFocus = true;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingFocusManager, {
    context: floatingContext,
    modal: isContextMenu,
    disabled: !mounted,
    returnFocus: finalFocus === void 0 ? returnFocus : finalFocus,
    initialFocus: parent.type !== "menu",
    restoreFocus: true,
    externalTree: parent.type !== "menubar" ? floatingTreeRoot : void 0,
    previousFocusableElement: activeTriggerElement,
    nextFocusableElement: parent.type === void 0 ? store.context.triggerFocusTargetRef : void 0,
    beforeContentFocusGuardRef: parent.type === void 0 ? store.context.beforeContentFocusGuardRef : void 0,
    children: element
  });
});
const MenuPortalContext = /* @__PURE__ */ reactExports.createContext(void 0);
function useMenuPortalContext() {
  const value = reactExports.useContext(MenuPortalContext);
  if (value === void 0) {
    throw new Error(formatErrorMessage(32));
  }
  return value;
}
const MenuPortal = /* @__PURE__ */ reactExports.forwardRef(function MenuPortal2(props, forwardedRef) {
  const {
    keepMounted = false,
    ...portalProps
  } = props;
  const {
    store
  } = useMenuRootContext();
  const mounted = store.useState("mounted");
  const shouldRender = mounted || keepMounted;
  if (!shouldRender) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuPortalContext.Provider, {
    value: keepMounted,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingPortal, {
      ref: forwardedRef,
      ...portalProps
    })
  });
});
function CompositeList(props) {
  const {
    children,
    elementsRef,
    labelsRef,
    onMapChange: onMapChangeProp
  } = props;
  const onMapChange = useStableCallback(onMapChangeProp);
  const nextIndexRef = reactExports.useRef(0);
  const listeners = useRefWithInit(createListeners).current;
  const map = useRefWithInit(createMap).current;
  const [mapTick, setMapTick] = reactExports.useState(0);
  const lastTickRef = reactExports.useRef(mapTick);
  const register = useStableCallback((node, metadata) => {
    map.set(node, metadata ?? null);
    lastTickRef.current += 1;
    setMapTick(lastTickRef.current);
  });
  const unregister = useStableCallback((node) => {
    map.delete(node);
    lastTickRef.current += 1;
    setMapTick(lastTickRef.current);
  });
  const sortedMap = reactExports.useMemo(() => {
    const newMap = /* @__PURE__ */ new Map();
    const sortedNodes = Array.from(map.keys()).filter((node) => node.isConnected).sort(sortByDocumentPosition);
    sortedNodes.forEach((node, index) => {
      const metadata = map.get(node) ?? {};
      newMap.set(node, {
        ...metadata,
        index
      });
    });
    return newMap;
  }, [map, mapTick]);
  useIsoLayoutEffect(() => {
    if (typeof MutationObserver !== "function" || sortedMap.size === 0) {
      return void 0;
    }
    const mutationObserver = new MutationObserver((entries) => {
      const diff = /* @__PURE__ */ new Set();
      const updateDiff = (node) => diff.has(node) ? diff.delete(node) : diff.add(node);
      entries.forEach((entry) => {
        entry.removedNodes.forEach(updateDiff);
        entry.addedNodes.forEach(updateDiff);
      });
      if (diff.size === 0) {
        lastTickRef.current += 1;
        setMapTick(lastTickRef.current);
      }
    });
    sortedMap.forEach((_, node) => {
      if (node.parentElement) {
        mutationObserver.observe(node.parentElement, {
          childList: true
        });
      }
    });
    return () => {
      mutationObserver.disconnect();
    };
  }, [sortedMap]);
  useIsoLayoutEffect(() => {
    const shouldUpdateLengths = lastTickRef.current === mapTick;
    if (shouldUpdateLengths) {
      if (elementsRef.current.length !== sortedMap.size) {
        elementsRef.current.length = sortedMap.size;
      }
      if (labelsRef && labelsRef.current.length !== sortedMap.size) {
        labelsRef.current.length = sortedMap.size;
      }
      nextIndexRef.current = sortedMap.size;
    }
    onMapChange(sortedMap);
  }, [onMapChange, sortedMap, elementsRef, labelsRef, mapTick]);
  useIsoLayoutEffect(() => {
    return () => {
      elementsRef.current = [];
    };
  }, [elementsRef]);
  useIsoLayoutEffect(() => {
    return () => {
      if (labelsRef) {
        labelsRef.current = [];
      }
    };
  }, [labelsRef]);
  const subscribeMapChange = useStableCallback((fn) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  });
  useIsoLayoutEffect(() => {
    listeners.forEach((l) => l(sortedMap));
  }, [listeners, sortedMap]);
  const contextValue = reactExports.useMemo(() => ({
    register,
    unregister,
    subscribeMapChange,
    elementsRef,
    labelsRef,
    nextIndexRef
  }), [register, unregister, subscribeMapChange, elementsRef, labelsRef, nextIndexRef]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(CompositeListContext.Provider, {
    value: contextValue,
    children
  });
}
function createMap() {
  return /* @__PURE__ */ new Map();
}
function createListeners() {
  return /* @__PURE__ */ new Set();
}
function sortByDocumentPosition(a, b) {
  const position = a.compareDocumentPosition(b);
  if (position & Node.DOCUMENT_POSITION_FOLLOWING || position & Node.DOCUMENT_POSITION_CONTAINED_BY) {
    return -1;
  }
  if (position & Node.DOCUMENT_POSITION_PRECEDING || position & Node.DOCUMENT_POSITION_CONTAINS) {
    return 1;
  }
  return 0;
}
const MenuPositioner = /* @__PURE__ */ reactExports.forwardRef(function MenuPositioner2(componentProps, forwardedRef) {
  const {
    anchor: anchorProp,
    positionMethod: positionMethodProp = "absolute",
    className,
    render,
    side,
    align: alignProp,
    sideOffset: sideOffsetProp = 0,
    alignOffset: alignOffsetProp = 0,
    collisionBoundary = "clipping-ancestors",
    collisionPadding = 5,
    arrowPadding = 5,
    sticky = false,
    disableAnchorTracking = false,
    collisionAvoidance: collisionAvoidanceProp = DROPDOWN_COLLISION_AVOIDANCE,
    ...elementProps
  } = componentProps;
  const {
    store
  } = useMenuRootContext();
  const keepMounted = useMenuPortalContext();
  const contextMenuContext = useContextMenuRootContext(true);
  const parent = store.useState("parent");
  const floatingRootContext = store.useState("floatingRootContext");
  const floatingTreeRoot = store.useState("floatingTreeRoot");
  const mounted = store.useState("mounted");
  const open = store.useState("open");
  const modal = store.useState("modal");
  const triggerElement = store.useState("activeTriggerElement");
  const lastOpenChangeReason = store.useState("lastOpenChangeReason");
  const floatingNodeId = store.useState("floatingNodeId");
  const floatingParentNodeId = store.useState("floatingParentNodeId");
  let anchor = anchorProp;
  let sideOffset = sideOffsetProp;
  let alignOffset = alignOffsetProp;
  let align = alignProp;
  let collisionAvoidance = collisionAvoidanceProp;
  if (parent.type === "context-menu") {
    anchor = anchorProp ?? parent.context?.anchor;
    align = align ?? "start";
    if (!side && align !== "center") {
      alignOffset = componentProps.alignOffset ?? 2;
      sideOffset = componentProps.sideOffset ?? -5;
    }
  }
  let computedSide = side;
  let computedAlign = align;
  if (parent.type === "menu") {
    computedSide = computedSide ?? "inline-end";
    computedAlign = computedAlign ?? "start";
    collisionAvoidance = componentProps.collisionAvoidance ?? POPUP_COLLISION_AVOIDANCE;
  } else if (parent.type === "menubar") {
    computedSide = computedSide ?? "bottom";
    computedAlign = computedAlign ?? "start";
  }
  const contextMenu = parent.type === "context-menu";
  const positioner = useAnchorPositioning({
    anchor,
    floatingRootContext,
    positionMethod: contextMenuContext ? "fixed" : positionMethodProp,
    mounted,
    side: computedSide,
    sideOffset,
    align: computedAlign,
    alignOffset,
    arrowPadding: contextMenu ? 0 : arrowPadding,
    collisionBoundary,
    collisionPadding,
    sticky,
    nodeId: floatingNodeId,
    keepMounted,
    disableAnchorTracking,
    collisionAvoidance,
    shiftCrossAxis: contextMenu,
    externalTree: floatingTreeRoot
  });
  const positionerProps = reactExports.useMemo(() => {
    const hiddenStyles = {};
    if (!open) {
      hiddenStyles.pointerEvents = "none";
    }
    return {
      role: "presentation",
      hidden: !mounted,
      style: {
        ...positioner.positionerStyles,
        ...hiddenStyles
      }
    };
  }, [open, mounted, positioner.positionerStyles]);
  reactExports.useEffect(() => {
    function onMenuOpenChange(details) {
      if (details.open) {
        if (details.parentNodeId === floatingNodeId) {
          store.set("hoverEnabled", false);
        }
        if (details.nodeId !== floatingNodeId && details.parentNodeId === store.select("floatingParentNodeId")) {
          store.setOpen(false, createChangeEventDetails(siblingOpen));
        }
      } else if (details.parentNodeId === floatingNodeId) {
        if (details.reason !== siblingOpen) {
          store.set("hoverEnabled", true);
        }
      }
    }
    floatingTreeRoot.events.on("menuopenchange", onMenuOpenChange);
    return () => {
      floatingTreeRoot.events.off("menuopenchange", onMenuOpenChange);
    };
  }, [store, floatingTreeRoot.events, floatingNodeId]);
  reactExports.useEffect(() => {
    if (store.select("floatingParentNodeId") == null) {
      return void 0;
    }
    function onParentClose(details) {
      if (details.open || details.nodeId !== store.select("floatingParentNodeId")) {
        return;
      }
      const reason = details.reason ?? siblingOpen;
      store.setOpen(false, createChangeEventDetails(reason));
    }
    floatingTreeRoot.events.on("menuopenchange", onParentClose);
    return () => {
      floatingTreeRoot.events.off("menuopenchange", onParentClose);
    };
  }, [floatingTreeRoot.events, store]);
  reactExports.useEffect(() => {
    function onItemHover(event) {
      if (!open || event.nodeId !== store.select("floatingParentNodeId")) {
        return;
      }
      if (event.target && triggerElement && triggerElement !== event.target) {
        store.setOpen(false, createChangeEventDetails(siblingOpen));
      }
    }
    floatingTreeRoot.events.on("itemhover", onItemHover);
    return () => {
      floatingTreeRoot.events.off("itemhover", onItemHover);
    };
  }, [floatingTreeRoot.events, open, triggerElement, store]);
  reactExports.useEffect(() => {
    const eventDetails = {
      open,
      nodeId: floatingNodeId,
      parentNodeId: floatingParentNodeId,
      reason: store.select("lastOpenChangeReason")
    };
    floatingTreeRoot.events.emit("menuopenchange", eventDetails);
  }, [floatingTreeRoot.events, open, store, floatingNodeId, floatingParentNodeId]);
  const state = reactExports.useMemo(() => ({
    open,
    side: positioner.side,
    align: positioner.align,
    anchorHidden: positioner.anchorHidden,
    nested: parent.type === "menu"
  }), [open, positioner.side, positioner.align, positioner.anchorHidden, parent.type]);
  const contextValue = reactExports.useMemo(() => ({
    side: positioner.side,
    align: positioner.align,
    arrowRef: positioner.arrowRef,
    arrowUncentered: positioner.arrowUncentered,
    arrowStyles: positioner.arrowStyles,
    nodeId: positioner.context.nodeId
  }), [positioner.side, positioner.align, positioner.arrowRef, positioner.arrowUncentered, positioner.arrowStyles, positioner.context.nodeId]);
  const element = useRenderElement("div", componentProps, {
    state,
    stateAttributesMapping: popupStateMapping,
    ref: [forwardedRef, store.useStateSetter("positionerElement")],
    props: [positionerProps, elementProps]
  });
  const shouldRenderBackdrop = mounted && parent.type !== "menu" && (parent.type !== "menubar" && modal && lastOpenChangeReason !== triggerHover || parent.type === "menubar" && parent.context.modal);
  let backdropCutout = null;
  if (parent.type === "menubar") {
    backdropCutout = parent.context.contentElement;
  } else if (parent.type === void 0) {
    backdropCutout = triggerElement;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(MenuPositionerContext.Provider, {
    value: contextValue,
    children: [shouldRenderBackdrop && /* @__PURE__ */ jsxRuntimeExports.jsx(InternalBackdrop, {
      ref: parent.type === "context-menu" || parent.type === "nested-context-menu" ? parent.context.internalBackdropRef : null,
      inert: inertValue(!open),
      cutout: backdropCutout
    }), /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingNode, {
      id: floatingNodeId,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CompositeList, {
        elementsRef: store.context.itemDomElements,
        labelsRef: store.context.itemLabels,
        children: element
      })
    })]
  });
});
const MenubarContext = /* @__PURE__ */ reactExports.createContext(null);
function useMenubarContext(optional) {
  const context = reactExports.useContext(MenubarContext);
  return context;
}
const selectors = {
  ...popupStoreSelectors,
  disabled: createSelector((state) => state.parent.type === "menubar" ? state.parent.context.disabled || state.disabled : state.disabled),
  modal: createSelector((state) => (state.parent.type === void 0 || state.parent.type === "context-menu") && (state.modal ?? true)),
  allowMouseEnter: createSelector((state) => state.parent.type === "menu" ? state.parent.store.select("allowMouseEnter") : state.allowMouseEnter),
  stickIfOpen: createSelector((state) => state.stickIfOpen),
  parent: createSelector((state) => state.parent),
  rootId: createSelector((state) => {
    if (state.parent.type === "menu") {
      return state.parent.store.select("rootId");
    }
    return state.parent.type !== void 0 ? state.parent.context.rootId : state.rootId;
  }),
  activeIndex: createSelector((state) => state.activeIndex),
  isActive: createSelector((state, itemIndex) => state.activeIndex === itemIndex),
  hoverEnabled: createSelector((state) => state.hoverEnabled),
  instantType: createSelector((state) => state.instantType),
  lastOpenChangeReason: createSelector((state) => state.openChangeReason),
  floatingTreeRoot: createSelector((state) => {
    if (state.parent.type === "menu") {
      return state.parent.store.select("floatingTreeRoot");
    }
    return state.floatingTreeRoot;
  }),
  floatingNodeId: createSelector((state) => state.floatingNodeId),
  floatingParentNodeId: createSelector((state) => state.floatingParentNodeId),
  itemProps: createSelector((state) => state.itemProps),
  closeDelay: createSelector((state) => state.closeDelay),
  keyboardEventRelay: createSelector((state) => {
    if (state.keyboardEventRelay) {
      return state.keyboardEventRelay;
    }
    if (state.parent.type === "menu") {
      return state.parent.store.select("keyboardEventRelay");
    }
    return void 0;
  })
};
class MenuStore extends ReactStore {
  constructor(initialState) {
    super({
      ...createInitialState(),
      ...initialState
    }, {
      positionerRef: /* @__PURE__ */ reactExports.createRef(),
      popupRef: /* @__PURE__ */ reactExports.createRef(),
      typingRef: {
        current: false
      },
      itemDomElements: {
        current: []
      },
      itemLabels: {
        current: []
      },
      allowMouseUpTriggerRef: {
        current: false
      },
      triggerFocusTargetRef: /* @__PURE__ */ reactExports.createRef(),
      beforeContentFocusGuardRef: /* @__PURE__ */ reactExports.createRef(),
      onOpenChangeComplete: void 0,
      triggerElements: new PopupTriggerMap()
    }, selectors);
    this.observe(createSelector((state) => state.allowMouseEnter), (allowMouseEnter, oldValue) => {
      if (this.state.parent.type === "menu" && allowMouseEnter !== oldValue) {
        this.state.parent.store.set("allowMouseEnter", allowMouseEnter);
      }
    });
    this.unsubscribeParentListener = this.observe("parent", (parent) => {
      this.unsubscribeParentListener?.();
      if (parent.type === "menu") {
        this.unsubscribeParentListener = parent.store.subscribe(() => {
          this.notifyAll();
        });
        this.context.allowMouseUpTriggerRef = parent.store.context.allowMouseUpTriggerRef;
        return;
      }
      if (parent.type !== void 0) {
        this.context.allowMouseUpTriggerRef = parent.context.allowMouseUpTriggerRef;
      }
      this.unsubscribeParentListener = null;
    });
  }
  setOpen(open, eventDetails) {
    this.state.floatingRootContext.context.events.emit("setOpen", {
      open,
      eventDetails
    });
  }
  static useStore(externalStore, initialState) {
    const internalStore = useRefWithInit(() => {
      return new MenuStore(initialState);
    }).current;
    return externalStore ?? internalStore;
  }
  unsubscribeParentListener = null;
}
function createInitialState() {
  return {
    ...createInitialPopupStoreState(),
    disabled: false,
    modal: true,
    allowMouseEnter: true,
    stickIfOpen: true,
    parent: {
      type: void 0
    },
    rootId: void 0,
    activeIndex: null,
    hoverEnabled: true,
    instantType: void 0,
    openChangeReason: null,
    floatingTreeRoot: new FloatingTreeStore(),
    floatingNodeId: void 0,
    floatingParentNodeId: null,
    itemProps: EMPTY_OBJECT,
    keyboardEventRelay: void 0,
    closeDelay: 0
  };
}
const MenuSubmenuRootContext = /* @__PURE__ */ reactExports.createContext(void 0);
function useMenuSubmenuRootContext() {
  return reactExports.useContext(MenuSubmenuRootContext);
}
function MenuRoot(props) {
  const {
    children,
    open: openProp,
    onOpenChange,
    onOpenChangeComplete,
    defaultOpen = false,
    disabled: disabledProp = false,
    modal: modalProp,
    loopFocus = true,
    orientation = "vertical",
    actionsRef,
    closeParentOnEsc = false,
    handle,
    triggerId: triggerIdProp,
    defaultTriggerId: defaultTriggerIdProp = null,
    highlightItemOnHover = true
  } = props;
  const contextMenuContext = useContextMenuRootContext(true);
  const parentMenuRootContext = useMenuRootContext(true);
  const menubarContext = useMenubarContext();
  const isSubmenu = useMenuSubmenuRootContext();
  const parentFromContext = reactExports.useMemo(() => {
    if (isSubmenu && parentMenuRootContext) {
      return {
        type: "menu",
        store: parentMenuRootContext.store
      };
    }
    if (menubarContext) {
      return {
        type: "menubar",
        context: menubarContext
      };
    }
    if (contextMenuContext && !parentMenuRootContext) {
      return {
        type: "context-menu",
        context: contextMenuContext
      };
    }
    return {
      type: void 0
    };
  }, [contextMenuContext, parentMenuRootContext, menubarContext, isSubmenu]);
  const store = MenuStore.useStore(handle?.store, {
    parent: parentFromContext
  });
  const floatingTreeRoot = store.useState("floatingTreeRoot");
  const floatingNodeIdFromContext = useFloatingNodeId(floatingTreeRoot);
  const floatingParentNodeIdFromContext = useFloatingParentNodeId();
  useIsoLayoutEffect(() => {
    if (contextMenuContext && !parentMenuRootContext) {
      store.update({
        parent: {
          type: "context-menu",
          context: contextMenuContext
        },
        floatingNodeId: floatingNodeIdFromContext,
        floatingParentNodeId: floatingParentNodeIdFromContext
      });
    } else if (parentMenuRootContext) {
      store.update({
        floatingNodeId: floatingNodeIdFromContext,
        floatingParentNodeId: floatingParentNodeIdFromContext
      });
    }
  }, [contextMenuContext, parentMenuRootContext, floatingNodeIdFromContext, floatingParentNodeIdFromContext, store]);
  store.useControlledProp("open", openProp, defaultOpen);
  store.useControlledProp("activeTriggerId", triggerIdProp, defaultTriggerIdProp);
  store.useContextCallback("onOpenChangeComplete", onOpenChangeComplete);
  const open = store.useState("open");
  const activeTriggerElement = store.useState("activeTriggerElement");
  const positionerElement = store.useState("positionerElement");
  const hoverEnabled = store.useState("hoverEnabled");
  const modal = store.useState("modal");
  const disabled = store.useState("disabled");
  const lastOpenChangeReason = store.useState("lastOpenChangeReason");
  const parent = store.useState("parent");
  const activeIndex = store.useState("activeIndex");
  const payload = store.useState("payload");
  const floatingParentNodeId = store.useState("floatingParentNodeId");
  const openEventRef = reactExports.useRef(null);
  const nested = floatingParentNodeId != null;
  let floatingEvents;
  store.useSyncedValues({
    disabled: disabledProp,
    modal: parent.type === void 0 ? modalProp : void 0,
    rootId: useId()
  });
  const {
    openMethod,
    triggerProps: interactionTypeProps,
    reset: resetOpenInteractionType
  } = useOpenInteractionType(open);
  useImplicitActiveTrigger(store);
  const {
    forceUnmount
  } = useOpenStateTransitions(open, store, () => {
    store.update({
      allowMouseEnter: false,
      stickIfOpen: true
    });
    resetOpenInteractionType();
  });
  const allowOutsidePressDismissalRef = reactExports.useRef(parent.type !== "context-menu");
  const allowOutsidePressDismissalTimeout = useTimeout();
  reactExports.useEffect(() => {
    if (!open) {
      openEventRef.current = null;
    }
    if (parent.type !== "context-menu") {
      return;
    }
    if (!open) {
      allowOutsidePressDismissalTimeout.clear();
      allowOutsidePressDismissalRef.current = false;
      return;
    }
    allowOutsidePressDismissalTimeout.start(500, () => {
      allowOutsidePressDismissalRef.current = true;
    });
  }, [allowOutsidePressDismissalTimeout, open, parent.type]);
  useScrollLock(open && modal && lastOpenChangeReason !== triggerHover && openMethod !== "touch", positionerElement);
  useIsoLayoutEffect(() => {
    if (!open && !hoverEnabled) {
      store.set("hoverEnabled", true);
    }
  }, [open, hoverEnabled, store]);
  const allowTouchToCloseRef = reactExports.useRef(true);
  const allowTouchToCloseTimeout = useTimeout();
  const setOpen = useStableCallback((nextOpen, eventDetails) => {
    const reason = eventDetails.reason;
    if (open === nextOpen && eventDetails.trigger === activeTriggerElement && lastOpenChangeReason === reason) {
      return;
    }
    eventDetails.preventUnmountOnClose = () => {
      store.set("preventUnmountingOnClose", true);
    };
    if (!nextOpen && eventDetails.trigger == null) {
      eventDetails.trigger = activeTriggerElement ?? void 0;
    }
    onOpenChange?.(nextOpen, eventDetails);
    if (eventDetails.isCanceled) {
      return;
    }
    const details = {
      open: nextOpen,
      nativeEvent: eventDetails.event,
      reason: eventDetails.reason,
      nested
    };
    floatingEvents?.emit("openchange", details);
    const nativeEvent = eventDetails.event;
    if (nextOpen === false && nativeEvent?.type === "click" && nativeEvent.pointerType === "touch" && !allowTouchToCloseRef.current) {
      return;
    }
    if (!nextOpen && activeIndex !== null) {
      const activeOption = store.context.itemDomElements.current[activeIndex];
      queueMicrotask(() => {
        activeOption?.setAttribute("tabindex", "-1");
      });
    }
    if (nextOpen && reason === triggerFocus) {
      allowTouchToCloseRef.current = false;
      allowTouchToCloseTimeout.start(300, () => {
        allowTouchToCloseRef.current = true;
      });
    } else {
      allowTouchToCloseRef.current = true;
      allowTouchToCloseTimeout.clear();
    }
    const isKeyboardClick = (reason === triggerPress || reason === itemPress) && nativeEvent.detail === 0 && nativeEvent?.isTrusted;
    const isDismissClose = !nextOpen && (reason === escapeKey || reason == null);
    function changeState() {
      const updatedState = {
        open: nextOpen,
        openChangeReason: reason
      };
      openEventRef.current = eventDetails.event ?? null;
      const newTriggerId = eventDetails.trigger?.id ?? null;
      if (newTriggerId || nextOpen) {
        updatedState.activeTriggerId = newTriggerId;
        updatedState.activeTriggerElement = eventDetails.trigger ?? null;
      }
      store.update(updatedState);
    }
    if (reason === triggerHover) {
      reactDomExports.flushSync(changeState);
    } else {
      changeState();
    }
    if (parent.type === "menubar" && (reason === triggerFocus || reason === focusOut || reason === triggerHover || reason === listNavigation || reason === siblingOpen)) {
      store.set("instantType", "group");
    } else if (isKeyboardClick || isDismissClose) {
      store.set("instantType", isKeyboardClick ? "click" : "dismiss");
    } else {
      store.set("instantType", void 0);
    }
  });
  const createMenuEventDetails = reactExports.useCallback((reason) => {
    const details = createChangeEventDetails(reason);
    details.preventUnmountOnClose = () => {
      store.set("preventUnmountingOnClose", true);
    };
    return details;
  }, [store]);
  const handleImperativeClose = reactExports.useCallback(() => {
    store.setOpen(false, createMenuEventDetails(imperativeAction));
  }, [store, createMenuEventDetails]);
  reactExports.useImperativeHandle(actionsRef, () => ({
    unmount: forceUnmount,
    close: handleImperativeClose
  }), [forceUnmount, handleImperativeClose]);
  let ctx;
  if (parent.type === "context-menu") {
    ctx = parent.context;
  }
  reactExports.useImperativeHandle(ctx?.positionerRef, () => positionerElement, [positionerElement]);
  reactExports.useImperativeHandle(ctx?.actionsRef, () => ({
    setOpen
  }), [setOpen]);
  const floatingRootContext = useSyncedFloatingRootContext({
    popupStore: store,
    onOpenChange: setOpen
  });
  floatingEvents = floatingRootContext.context.events;
  reactExports.useEffect(() => {
    const handleSetOpenEvent = ({
      open: nextOpen,
      eventDetails
    }) => setOpen(nextOpen, eventDetails);
    floatingEvents.on("setOpen", handleSetOpenEvent);
    return () => {
      floatingEvents?.off("setOpen", handleSetOpenEvent);
    };
  }, [floatingEvents, setOpen]);
  const dismiss = useDismiss(floatingRootContext, {
    enabled: !disabled,
    bubbles: {
      escapeKey: closeParentOnEsc && parent.type === "menu"
    },
    outsidePress() {
      if (parent.type !== "context-menu" || openEventRef.current?.type === "contextmenu") {
        return true;
      }
      return allowOutsidePressDismissalRef.current;
    },
    externalTree: nested ? floatingTreeRoot : void 0
  });
  const role = useRole(floatingRootContext, {
    role: "menu"
  });
  const direction = useDirection();
  const setActiveIndex = reactExports.useCallback((index) => {
    if (store.select("activeIndex") === index) {
      return;
    }
    store.set("activeIndex", index);
  }, [store]);
  const listNavigation$1 = useListNavigation(floatingRootContext, {
    enabled: !disabled,
    listRef: store.context.itemDomElements,
    activeIndex,
    nested: parent.type !== void 0,
    loopFocus,
    orientation,
    parentOrientation: parent.type === "menubar" ? parent.context.orientation : void 0,
    rtl: direction === "rtl",
    disabledIndices: EMPTY_ARRAY,
    onNavigate: setActiveIndex,
    openOnArrowKeyDown: parent.type !== "context-menu",
    externalTree: nested ? floatingTreeRoot : void 0,
    focusItemOnHover: highlightItemOnHover
  });
  const onTypingChange = reactExports.useCallback((nextTyping) => {
    store.context.typingRef.current = nextTyping;
  }, [store]);
  const typeahead = useTypeahead(floatingRootContext, {
    listRef: store.context.itemLabels,
    activeIndex,
    resetMs: TYPEAHEAD_RESET_MS,
    onMatch: (index) => {
      if (open && index !== activeIndex) {
        store.set("activeIndex", index);
      }
    },
    onTypingChange
  });
  const {
    getReferenceProps,
    getFloatingProps,
    getItemProps,
    getTriggerProps
  } = useInteractions([dismiss, role, listNavigation$1, typeahead]);
  const activeTriggerProps = reactExports.useMemo(() => {
    const mergedProps = mergeProps$1(getReferenceProps(), {
      onMouseEnter() {
        store.set("hoverEnabled", true);
      },
      onMouseMove() {
        store.set("allowMouseEnter", true);
      }
    }, interactionTypeProps);
    delete mergedProps.role;
    return mergedProps;
  }, [getReferenceProps, store, interactionTypeProps]);
  const inactiveTriggerProps = reactExports.useMemo(() => {
    const triggerProps = getTriggerProps();
    if (!triggerProps) {
      return triggerProps;
    }
    const mergedProps = mergeProps$1(triggerProps, interactionTypeProps);
    delete mergedProps.role;
    delete mergedProps["aria-controls"];
    return mergedProps;
  }, [getTriggerProps, interactionTypeProps]);
  const disableHoverTimeout = useAnimationFrame();
  const popupProps = reactExports.useMemo(() => getFloatingProps({
    onMouseEnter() {
      if (parent.type === "menu") {
        disableHoverTimeout.request(() => store.set("hoverEnabled", false));
      }
    },
    onMouseMove() {
      store.set("allowMouseEnter", true);
    },
    onClick() {
      if (store.select("hoverEnabled")) {
        store.set("hoverEnabled", false);
      }
    },
    onKeyDown(event) {
      const relay = store.select("keyboardEventRelay");
      if (relay && !event.isPropagationStopped()) {
        relay(event);
      }
    }
  }), [getFloatingProps, parent.type, disableHoverTimeout, store]);
  const itemProps = reactExports.useMemo(() => getItemProps(), [getItemProps]);
  store.useSyncedValues({
    floatingRootContext,
    activeTriggerProps,
    inactiveTriggerProps,
    popupProps,
    itemProps
  });
  const context = reactExports.useMemo(() => ({
    store,
    parent: parentFromContext
  }), [store, parentFromContext]);
  const content = /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRootContext.Provider, {
    value: context,
    children: typeof children === "function" ? children({
      payload
    }) : children
  });
  if (parent.type === void 0 || parent.type === "context-menu") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingTree, {
      externalTree: floatingTreeRoot,
      children: content
    });
  }
  return content;
}
function getPseudoElementBounds(element) {
  const elementRect = element.getBoundingClientRect();
  const beforeStyles = window.getComputedStyle(element, "::before");
  const afterStyles = window.getComputedStyle(element, "::after");
  const hasPseudoElements = beforeStyles.content !== "none" || afterStyles.content !== "none";
  if (!hasPseudoElements) {
    return elementRect;
  }
  const beforeWidth = parseFloat(beforeStyles.width) || 0;
  const beforeHeight = parseFloat(beforeStyles.height) || 0;
  const afterWidth = parseFloat(afterStyles.width) || 0;
  const afterHeight = parseFloat(afterStyles.height) || 0;
  const totalWidth = Math.max(elementRect.width, beforeWidth, afterWidth);
  const totalHeight = Math.max(elementRect.height, beforeHeight, afterHeight);
  const widthDiff = totalWidth - elementRect.width;
  const heightDiff = totalHeight - elementRect.height;
  return {
    left: elementRect.left - widthDiff / 2,
    right: elementRect.right + widthDiff / 2,
    top: elementRect.top - heightDiff / 2,
    bottom: elementRect.bottom + heightDiff / 2
  };
}
function useCompositeItem(params = {}) {
  const {
    highlightItemOnHover,
    highlightedIndex,
    onHighlightedIndexChange
  } = useCompositeRootContext();
  const {
    ref,
    index
  } = useCompositeListItem(params);
  const isHighlighted = highlightedIndex === index;
  const itemRef = reactExports.useRef(null);
  const mergedRef = useMergedRefs(ref, itemRef);
  const compositeProps = reactExports.useMemo(() => ({
    tabIndex: isHighlighted ? 0 : -1,
    onFocus() {
      onHighlightedIndexChange(index);
    },
    onMouseMove() {
      const item = itemRef.current;
      if (!highlightItemOnHover || !item) {
        return;
      }
      const disabled = item.hasAttribute("disabled") || item.ariaDisabled === "true";
      if (!isHighlighted && !disabled) {
        item.focus();
      }
    }
  }), [isHighlighted, onHighlightedIndexChange, index, highlightItemOnHover]);
  return {
    compositeProps,
    compositeRef: mergedRef,
    index
  };
}
function CompositeItem(componentProps) {
  const {
    render,
    className,
    state = EMPTY_OBJECT,
    props = EMPTY_ARRAY,
    refs = EMPTY_ARRAY,
    metadata,
    stateAttributesMapping: stateAttributesMapping2,
    tag = "div",
    ...elementProps
  } = componentProps;
  const {
    compositeProps,
    compositeRef
  } = useCompositeItem({
    metadata
  });
  return useRenderElement(tag, componentProps, {
    state,
    ref: [...refs, compositeRef],
    props: [compositeProps, ...props, elementProps],
    stateAttributesMapping: stateAttributesMapping2
  });
}
function findRootOwnerId(node) {
  if (isHTMLElement(node) && node.hasAttribute("data-rootownerid")) {
    return node.getAttribute("data-rootownerid") ?? void 0;
  }
  if (isLastTraversableNode(node)) {
    return void 0;
  }
  return findRootOwnerId(getParentNode(node));
}
function useMixedToggleClickHandler(params) {
  const {
    enabled = true,
    mouseDownAction,
    open
  } = params;
  const ignoreClickRef = reactExports.useRef(false);
  return reactExports.useMemo(() => {
    if (!enabled) {
      return EMPTY_OBJECT;
    }
    return {
      onMouseDown: (event) => {
        if (mouseDownAction === "open" && !open || mouseDownAction === "close" && open) {
          ignoreClickRef.current = true;
          ownerDocument(event.currentTarget).addEventListener("click", () => {
            ignoreClickRef.current = false;
          }, {
            once: true
          });
        }
      },
      onClick: (event) => {
        if (ignoreClickRef.current) {
          ignoreClickRef.current = false;
          event.preventBaseUIHandler();
        }
      }
    };
  }, [enabled, mouseDownAction, open]);
}
const BOUNDARY_OFFSET = 2;
const MenuTrigger = /* @__PURE__ */ reactExports.forwardRef(function MenuTrigger2(componentProps, forwardedRef) {
  const {
    render,
    className,
    disabled: disabledProp = false,
    nativeButton = true,
    id: idProp,
    openOnHover: openOnHoverProp,
    delay = 100,
    closeDelay = 0,
    handle,
    payload,
    ...elementProps
  } = componentProps;
  const rootContext = useMenuRootContext(true);
  const store = handle?.store ?? rootContext?.store;
  if (!store) {
    throw new Error(formatErrorMessage(85));
  }
  const thisTriggerId = useBaseUiId(idProp);
  const isTriggerActive = store.useState("isTriggerActive", thisTriggerId);
  const floatingRootContext = store.useState("floatingRootContext");
  const isOpenedByThisTrigger = store.useState("isOpenedByTrigger", thisTriggerId);
  const triggerElementRef = reactExports.useRef(null);
  const parent = useMenuParent();
  const compositeRootContext = useCompositeRootContext(true);
  const floatingTreeRootFromContext = useFloatingTree();
  const floatingTreeRoot = reactExports.useMemo(() => {
    return floatingTreeRootFromContext ?? new FloatingTreeStore();
  }, [floatingTreeRootFromContext]);
  const floatingNodeId = useFloatingNodeId(floatingTreeRoot);
  const floatingParentNodeId = useFloatingParentNodeId();
  const {
    registerTrigger,
    isMountedByThisTrigger
  } = useTriggerDataForwarding(thisTriggerId, triggerElementRef, store, {
    payload,
    closeDelay,
    parent,
    floatingTreeRoot,
    floatingNodeId,
    floatingParentNodeId,
    keyboardEventRelay: compositeRootContext?.relayKeyboardEvent
  });
  const isInMenubar = parent.type === "menubar";
  const rootDisabled = store.useState("disabled");
  const disabled = disabledProp || rootDisabled || isInMenubar && parent.context.disabled;
  const {
    getButtonProps,
    buttonRef
  } = useButton({
    disabled,
    native: nativeButton
  });
  reactExports.useEffect(() => {
    if (!isOpenedByThisTrigger && parent.type === void 0) {
      store.context.allowMouseUpTriggerRef.current = false;
    }
  }, [store, isOpenedByThisTrigger, parent.type]);
  const triggerRef = reactExports.useRef(null);
  const allowMouseUpTriggerTimeout = useTimeout();
  const handleDocumentMouseUp = useStableCallback((mouseEvent) => {
    if (!triggerRef.current) {
      return;
    }
    allowMouseUpTriggerTimeout.clear();
    store.context.allowMouseUpTriggerRef.current = false;
    const mouseUpTarget = mouseEvent.target;
    if (contains(triggerRef.current, mouseUpTarget) || contains(store.select("positionerElement"), mouseUpTarget) || mouseUpTarget === triggerRef.current) {
      return;
    }
    if (mouseUpTarget != null && findRootOwnerId(mouseUpTarget) === store.select("rootId")) {
      return;
    }
    const bounds = getPseudoElementBounds(triggerRef.current);
    if (mouseEvent.clientX >= bounds.left - BOUNDARY_OFFSET && mouseEvent.clientX <= bounds.right + BOUNDARY_OFFSET && mouseEvent.clientY >= bounds.top - BOUNDARY_OFFSET && mouseEvent.clientY <= bounds.bottom + BOUNDARY_OFFSET) {
      return;
    }
    floatingTreeRoot.events.emit("close", {
      domEvent: mouseEvent,
      reason: cancelOpen
    });
  });
  reactExports.useEffect(() => {
    if (isOpenedByThisTrigger && store.select("lastOpenChangeReason") === triggerHover) {
      const doc = ownerDocument(triggerRef.current);
      doc.addEventListener("mouseup", handleDocumentMouseUp, {
        once: true
      });
    }
  }, [isOpenedByThisTrigger, handleDocumentMouseUp, store]);
  const parentMenubarHasSubmenuOpen = isInMenubar && parent.context.hasSubmenuOpen;
  const openOnHover = openOnHoverProp ?? parentMenubarHasSubmenuOpen;
  const hoverProps = useHoverReferenceInteraction(floatingRootContext, {
    enabled: openOnHover && !disabled && parent.type !== "context-menu" && (!isInMenubar || parentMenubarHasSubmenuOpen && !isMountedByThisTrigger),
    handleClose: safePolygon({
      blockPointerEvents: !isInMenubar
    }),
    mouseOnly: true,
    move: false,
    restMs: parent.type === void 0 ? delay : void 0,
    delay: {
      close: closeDelay
    },
    triggerElementRef,
    externalTree: floatingTreeRoot,
    isActiveTrigger: isTriggerActive
  });
  const stickIfOpen = useStickIfOpen(isOpenedByThisTrigger, store.select("lastOpenChangeReason"));
  const click = useClick(floatingRootContext, {
    enabled: !disabled && parent.type !== "context-menu",
    event: isOpenedByThisTrigger && isInMenubar ? "click" : "mousedown",
    toggle: true,
    ignoreMouse: false,
    stickIfOpen: parent.type === void 0 ? stickIfOpen : false
  });
  const focus = useFocus(floatingRootContext, {
    enabled: !disabled && parentMenubarHasSubmenuOpen
  });
  const mixedToggleHandlers = useMixedToggleClickHandler({
    open: isOpenedByThisTrigger,
    enabled: isInMenubar,
    mouseDownAction: "open"
  });
  const localInteractionProps = useInteractions([click, focus]);
  const state = reactExports.useMemo(() => ({
    disabled,
    open: isOpenedByThisTrigger
  }), [disabled, isOpenedByThisTrigger]);
  const rootTriggerProps = store.useState("triggerProps", isMountedByThisTrigger);
  const ref = [triggerRef, forwardedRef, buttonRef, registerTrigger, triggerElementRef];
  const props = [localInteractionProps.getReferenceProps(), hoverProps ?? EMPTY_OBJECT, rootTriggerProps, {
    "aria-haspopup": "menu",
    id: thisTriggerId,
    onMouseDown: (event) => {
      if (store.select("open")) {
        return;
      }
      allowMouseUpTriggerTimeout.start(200, () => {
        store.context.allowMouseUpTriggerRef.current = true;
      });
      const doc = ownerDocument(event.currentTarget);
      doc.addEventListener("mouseup", handleDocumentMouseUp, {
        once: true
      });
    }
  }, isInMenubar ? {
    role: "menuitem"
  } : {}, mixedToggleHandlers, elementProps, getButtonProps];
  const preFocusGuardRef = reactExports.useRef(null);
  const handlePreFocusGuardFocus = useStableCallback((event) => {
    reactDomExports.flushSync(() => {
      store.setOpen(false, createChangeEventDetails(focusOut, event.nativeEvent, event.currentTarget));
    });
    const previousTabbable = getTabbableBeforeElement(preFocusGuardRef.current);
    previousTabbable?.focus();
  });
  const handleFocusTargetFocus = useStableCallback((event) => {
    const currentPositionerElement = store.select("positionerElement");
    if (currentPositionerElement && isOutsideEvent(event, currentPositionerElement)) {
      store.context.beforeContentFocusGuardRef.current?.focus();
    } else {
      reactDomExports.flushSync(() => {
        store.setOpen(false, createChangeEventDetails(focusOut, event.nativeEvent, event.currentTarget));
      });
      let nextTabbable = getTabbableAfterElement(store.context.triggerFocusTargetRef.current || triggerElementRef.current);
      while (nextTabbable !== null && contains(currentPositionerElement, nextTabbable)) {
        const prevTabbable = nextTabbable;
        nextTabbable = getNextTabbable(nextTabbable);
        if (nextTabbable === prevTabbable) {
          break;
        }
      }
      nextTabbable?.focus();
    }
  });
  const element = useRenderElement("button", componentProps, {
    enabled: !isInMenubar,
    stateAttributesMapping: pressableTriggerOpenStateMapping,
    state,
    ref,
    props
  });
  if (isInMenubar) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CompositeItem, {
      tag: "button",
      render,
      className,
      state,
      refs: ref,
      props,
      stateAttributesMapping: pressableTriggerOpenStateMapping
    });
  }
  if (isOpenedByThisTrigger) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, {
      children: [/* @__PURE__ */ jsxRuntimeExports.jsx(FocusGuard, {
        ref: preFocusGuardRef,
        onFocus: handlePreFocusGuardFocus
      }, `${thisTriggerId}-pre-focus-guard`), /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Fragment, {
        children: element
      }, thisTriggerId), /* @__PURE__ */ jsxRuntimeExports.jsx(FocusGuard, {
        ref: store.context.triggerFocusTargetRef,
        onFocus: handleFocusTargetFocus
      }, `${thisTriggerId}-post-focus-guard`)]
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Fragment, {
    children: element
  }, thisTriggerId);
});
function useStickIfOpen(open, openReason) {
  const stickIfOpenTimeout = useTimeout();
  const [stickIfOpen, setStickIfOpen] = reactExports.useState(false);
  useIsoLayoutEffect(() => {
    if (open && openReason === "trigger-hover") {
      setStickIfOpen(true);
      stickIfOpenTimeout.start(PATIENT_CLICK_THRESHOLD, () => {
        setStickIfOpen(false);
      });
    } else if (!open) {
      stickIfOpenTimeout.clear();
      setStickIfOpen(false);
    }
  }, [open, openReason, stickIfOpenTimeout]);
  return stickIfOpen;
}
function useMenuParent() {
  const contextMenuContext = useContextMenuRootContext(true);
  const parentContext = useMenuRootContext(true);
  const menubarContext = useMenubarContext();
  const parent = reactExports.useMemo(() => {
    if (menubarContext) {
      return {
        type: "menubar",
        context: menubarContext
      };
    }
    if (contextMenuContext && !parentContext) {
      return {
        type: "context-menu",
        context: contextMenuContext
      };
    }
    return {
      type: void 0
    };
  }, [contextMenuContext, parentContext, menubarContext]);
  return parent;
}
export {
  AlertDialogRoot as A,
  DialogViewport as B,
  FieldLabel as C,
  DialogPortal as D,
  FieldControl as E,
  FieldRoot as F,
  FieldError as G,
  MenuRoot as M,
  PopoverRoot as P,
  ToastProvider as T,
  useToastManager as a,
  ToastPortal as b,
  createToastManager as c,
  ToastViewport as d,
  ToastRoot as e,
  ToastContent as f,
  ToastTitle as g,
  ToastDescription as h,
  ToastAction as i,
  PopoverTrigger as j,
  PopoverPortal as k,
  PopoverPositioner as l,
  mergeProps$1 as m,
  PopoverPopup as n,
  PopoverViewport as o,
  MenuTrigger as p,
  MenuPortal as q,
  MenuPositioner as r,
  MenuPopup as s,
  MenuItem as t,
  useRender as u,
  DialogPopup as v,
  DialogTitle as w,
  DialogDescription as x,
  DialogClose as y,
  DialogBackdrop as z
};
