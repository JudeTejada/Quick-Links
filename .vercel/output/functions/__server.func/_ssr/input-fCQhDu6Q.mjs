import { c as cn, t as toastManager } from "./router-tLPzzNbq.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { F as FieldRoot, C as FieldLabel$1, E as FieldControl, m as mergeProps, G as FieldError$1 } from "../_libs/@base-ui/react.mjs";
const statusMap = {
  success: "success",
  danger: "error",
  warning: "warning",
  info: "info"
};
function notify({ status, title, description }) {
  toastManager.add({
    title,
    description,
    type: statusMap[status]
  });
}
function Field({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FieldRoot,
    {
      className: cn("flex flex-col items-start gap-2", className),
      "data-slot": "field",
      ...props
    }
  );
}
function FieldLabel({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FieldLabel$1,
    {
      className: cn(
        "inline-flex items-center gap-2 font-medium text-base/4.5 sm:text-sm/4",
        className
      ),
      "data-slot": "field-label",
      ...props
    }
  );
}
function FieldError({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FieldError$1,
    {
      className: cn("text-destructive-foreground text-xs", className),
      "data-slot": "field-error",
      ...props
    }
  );
}
const Input = reactExports.forwardRef(function Input2({ className, size = "default", unstyled = false, nativeInput = false, ...props }, ref) {
  const inputClassName = cn(
    "h-8.5 w-full min-w-0 rounded-[inherit] bg-transparent px-[calc(--spacing(3)-1px)] leading-8.5 outline-none",
    size === "sm" && "h-7.5 px-[calc(--spacing(2.5)-1px)] leading-7.5",
    size === "lg" && "h-9.5 leading-9.5"
  );
  if (nativeInput) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: cn(inputClassName, className),
        "data-size": typeof size === "string" ? size : void 0,
        "data-slot": "input",
        ref,
        ...props
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: cn(
        !unstyled && "relative inline-flex w-full rounded-lg border border-input bg-background not-dark:bg-clip-padding text-base shadow-xs/5 ring-ring/24 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] has-focus-visible:has-aria-invalid:border-destructive/64 has-focus-visible:has-aria-invalid:ring-destructive/16 has-aria-invalid:border-destructive/36 has-focus-visible:border-ring has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none has-focus-visible:ring-[3px] not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/6%)] sm:text-sm dark:bg-input/32 dark:has-aria-invalid:ring-destructive/24 dark:not-has-disabled:has-not-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        className
      ) || void 0,
      "data-size": size,
      "data-slot": "input-control",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        FieldControl,
        {
          render: (defaultProps) => {
            const { ref: defaultRef, ...restDefaultProps } = defaultProps;
            const mergedProps = mergeProps(restDefaultProps, props);
            const composedRef = (node) => {
              if (typeof defaultRef === "function") {
                defaultRef(node);
              } else if (defaultRef) {
                defaultRef.current = node;
              }
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            };
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: inputClassName,
                "data-slot": "input",
                ref: composedRef,
                ...mergedProps
              }
            );
          }
        }
      )
    }
  );
});
export {
  Field as F,
  Input as I,
  FieldLabel as a,
  FieldError as b,
  notify as n
};
