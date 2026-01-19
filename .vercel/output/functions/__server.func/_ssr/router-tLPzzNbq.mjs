import { c as createRouter, a as createRootRoute, b as createFileRoute, l as lazyRouteComponent, H as HeadContent, S as Scripts, L as Link } from "../_libs/@tanstack/react-router.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { C as ConvexAuthProvider } from "../_libs/@convex-dev/auth.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { T as TriangleAlert, C as CircleCheck, L as LoaderCircle, I as Info, a as CircleAlert } from "../_libs/lucide-react.mjs";
import { b as ConvexReactClient } from "../_libs/convex.mjs";
import { T as ToastProvider$1, c as createToastManager, u as useRender, m as mergeProps, a as useToastManager, b as ToastPortal, d as ToastViewport, e as ToastRoot, f as ToastContent, g as ToastTitle, h as ToastDescription, i as ToastAction } from "../_libs/@base-ui/react.mjs";
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
import "../_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_libs/@floating-ui/utils.mjs";
import "../_libs/tabbable.mjs";
import "../_libs/@floating-ui/react-dom.mjs";
import "../_libs/@floating-ui/dom.mjs";
import "../_libs/@floating-ui/core.mjs";
const appCss = "/assets/styles-VMeoaoHX.css";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "[&_svg]:-mx-0.5 relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border font-medium text-base outline-none transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] pointer-coarse:after:absolute pointer-coarse:after:size-full pointer-coarse:after:min-h-11 pointer-coarse:after:min-w-11 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-64 sm:text-sm [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: "default",
      variant: "default"
    },
    variants: {
      size: {
        default: "h-9 px-[calc(--spacing(3)-1px)] sm:h-8",
        icon: "size-9 sm:size-8",
        "icon-lg": "size-10 sm:size-9",
        "icon-sm": "size-8 sm:size-7",
        "icon-xl": "size-11 sm:size-10 [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5",
        "icon-xs": "size-7 rounded-md before:rounded-[calc(var(--radius-md)-1px)] sm:size-6 not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-4 sm:not-in-data-[slot=input-group]:[&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 px-[calc(--spacing(3.5)-1px)] sm:h-9",
        sm: "h-8 gap-1.5 px-[calc(--spacing(2.5)-1px)] sm:h-7",
        xl: "h-11 px-[calc(--spacing(4)-1px)] text-lg sm:h-10 sm:text-base [&_svg:not([class*='size-'])]:size-5 sm:[&_svg:not([class*='size-'])]:size-4.5",
        xs: "h-7 gap-1 rounded-md px-[calc(--spacing(2)-1px)] text-sm before:rounded-[calc(var(--radius-md)-1px)] sm:h-6 sm:text-xs [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5"
      },
      variant: {
        default: "not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)] border-primary bg-primary text-primary-foreground shadow-primary/24 shadow-xs [:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/8%)] [:disabled,:active,[data-pressed]]:shadow-none [:hover,[data-pressed]]:bg-primary/90",
        destructive: "not-disabled:inset-shadow-[0_1px_--theme(--color-white/16%)] border-destructive bg-destructive text-white shadow-destructive/24 shadow-xs [:active,[data-pressed]]:inset-shadow-[0_1px_--theme(--color-black/8%)] [:disabled,:active,[data-pressed]]:shadow-none [:hover,[data-pressed]]:bg-destructive/90",
        "destructive-outline": "border-input bg-transparent not-dark:bg-clip-padding text-destructive-foreground shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/6%)] dark:bg-input/32 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [:disabled,:active,[data-pressed]]:shadow-none [:hover,[data-pressed]]:border-destructive/32 [:hover,[data-pressed]]:bg-destructive/4",
        ghost: "border-transparent data-pressed:bg-accent [:hover,[data-pressed]]:bg-accent",
        link: "border-transparent underline-offset-4 [:hover,[data-pressed]]:underline",
        outline: "border-input bg-background not-dark:bg-clip-padding shadow-xs/5 not-disabled:not-active:not-data-pressed:before:shadow-[0_1px_--theme(--color-black/6%)] dark:bg-input/32 dark:not-disabled:before:shadow-[0_-1px_--theme(--color-white/2%)] dark:not-disabled:not-active:not-data-pressed:before:shadow-[0_-1px_--theme(--color-white/6%)] [:disabled,:active,[data-pressed]]:shadow-none [:hover,[data-pressed]]:bg-accent/50 dark:[:hover,[data-pressed]]:bg-input/64",
        secondary: "border-transparent bg-secondary text-secondary-foreground [:active,[data-pressed]]:bg-secondary/80 [:hover,[data-pressed]]:bg-secondary/90"
      }
    }
  }
);
function Button({ className, variant, size, render, ...props }) {
  const typeValue = render ? void 0 : "button";
  const defaultProps = {
    className: cn(buttonVariants({ className, size, variant })),
    "data-slot": "button",
    type: typeValue
  };
  return useRender({
    defaultTagName: "button",
    props: mergeProps(defaultProps, props),
    render
  });
}
function Page404() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-gradient-to-br from-[#d4e7d2] via-[#e2f0de] to-[#c7dcc5] p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex min-h-[calc(100vh-3rem)] max-w-5xl items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-white p-8 text-center shadow-2xl ring-1 ring-black/5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-600", children: "You bumped in a 404 page." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4", children: "Back to Home" }) })
  ] }) }) });
}
const convex = new ConvexReactClient("https://incredible-goat-800.convex.cloud");
const toastManager = createToastManager();
const TOAST_ICONS = {
  error: CircleAlert,
  info: Info,
  loading: LoaderCircle,
  success: CircleCheck,
  warning: TriangleAlert
};
function ToastProvider({ children, position = "bottom-right", ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ToastProvider$1, { toastManager, ...props, children: [
    children,
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toasts, { position })
  ] });
}
function Toasts({ position = "bottom-right" }) {
  const { toasts } = useToastManager();
  const isTop = position.startsWith("top");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ToastPortal, { "data-slot": "toast-portal", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    ToastViewport,
    {
      className: cn(
        "fixed z-50 mx-auto flex w-[calc(100%-var(--toast-inset)*2)] max-w-90 [--toast-inset:--spacing(4)] sm:[--toast-inset:--spacing(8)]",
        // Vertical positioning
        "data-[position*=top]:top-(--toast-inset)",
        "data-[position*=bottom]:bottom-(--toast-inset)",
        // Horizontal positioning
        "data-[position*=left]:left-(--toast-inset)",
        "data-[position*=right]:right-(--toast-inset)",
        "data-[position*=center]:-translate-x-1/2 data-[position*=center]:left-1/2"
      ),
      "data-position": position,
      "data-slot": "toast-viewport",
      children: toasts.map((toast) => {
        const Icon = toast.type ? TOAST_ICONS[toast.type] : null;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToastRoot,
          {
            className: cn(
              "absolute z-[calc(9999-var(--toast-index))] h-(--toast-calc-height) w-full select-none rounded-lg border bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 [transition:transform_.5s_cubic-bezier(.22,1,.36,1),opacity_.5s,height_.15s] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/6%)] dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
              // Base positioning using data-position
              "data-[position*=right]:right-0 data-[position*=right]:left-auto",
              "data-[position*=left]:right-auto data-[position*=left]:left-0",
              "data-[position*=center]:right-0 data-[position*=center]:left-0",
              "data-[position*=top]:top-0 data-[position*=top]:bottom-auto data-[position*=top]:origin-top",
              "data-[position*=bottom]:top-auto data-[position*=bottom]:bottom-0 data-[position*=bottom]:origin-bottom",
              // Gap fill for hover
              "after:absolute after:left-0 after:h-[calc(var(--toast-gap)+1px)] after:w-full",
              "data-[position*=top]:after:top-full",
              "data-[position*=bottom]:after:bottom-full",
              // Define some variables
              "[--toast-calc-height:var(--toast-frontmost-height,var(--toast-height))] [--toast-gap:--spacing(3)] [--toast-peek:--spacing(3)] [--toast-scale:calc(max(0,1-(var(--toast-index)*.1)))] [--toast-shrink:calc(1-var(--toast-scale))]",
              // Define offset-y variable
              "data-[position*=top]:[--toast-calc-offset-y:calc(var(--toast-offset-y)+var(--toast-index)*var(--toast-gap)+var(--toast-swipe-movement-y))]",
              "data-[position*=bottom]:[--toast-calc-offset-y:calc(var(--toast-offset-y)*-1+var(--toast-index)*var(--toast-gap)*-1+var(--toast-swipe-movement-y))]",
              // Default state transform
              "data-[position*=top]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--toast-peek))+(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]",
              "data-[position*=bottom]:transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--toast-peek))-(var(--toast-shrink)*var(--toast-calc-height))))_scale(var(--toast-scale))]",
              // Limited state
              "data-limited:opacity-0",
              // Expanded state
              "data-expanded:h-(--toast-height)",
              "data-position:data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--toast-calc-offset-y))]",
              // Starting and ending animations
              "data-[position*=top]:data-starting-style:transform-[translateY(calc(-100%-var(--toast-inset)))]",
              "data-[position*=bottom]:data-starting-style:transform-[translateY(calc(100%+var(--toast-inset)))]",
              "data-ending-style:opacity-0",
              // Ending animations (direction-aware)
              "data-ending-style:not-data-limited:not-data-swipe-direction:transform-[translateY(calc(100%+var(--toast-inset)))]",
              "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
              "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
              "data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]",
              "data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]",
              // Ending animations (expanded)
              "data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-100%-var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
              "data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+100%+var(--toast-inset)))_translateY(var(--toast-calc-offset-y))]",
              "data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-100%-var(--toast-inset)))]",
              "data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+100%+var(--toast-inset)))]"
            ),
            "data-position": position,
            swipeDirection: position.includes("center") ? [isTop ? "up" : "down"] : position.includes("left") ? ["left", isTop ? "up" : "down"] : ["right", isTop ? "up" : "down"],
            toast,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(ToastContent, { className: "pointer-events-auto flex items-center justify-between gap-1.5 overflow-hidden px-3.5 py-3 text-sm transition-opacity duration-250 data-behind:pointer-events-none data-behind:opacity-0 data-expanded:opacity-100", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "[&>svg]:h-lh [&>svg]:w-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
                    "data-slot": "toast-icon",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "in-data-[type=loading]:animate-spin in-data-[type=error]:text-destructive in-data-[type=info]:text-info in-data-[type=success]:text-success in-data-[type=warning]:text-warning in-data-[type=loading]:opacity-80" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ToastTitle, { className: "font-medium", "data-slot": "toast-title" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ToastDescription,
                    {
                      className: "text-muted-foreground",
                      "data-slot": "toast-description"
                    }
                  )
                ] })
              ] }),
              toast.actionProps && /* @__PURE__ */ jsxRuntimeExports.jsx(ToastAction, { className: buttonVariants({ size: "xs" }), "data-slot": "toast-action", children: toast.actionProps.children })
            ] })
          },
          toast.id
        );
      })
    }
  ) });
}
const Route$2 = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "Quick Links"
      },
      {
        name: "robots",
        content: "follow, index"
      },
      {
        name: "description",
        content: "Manage and save your bookmarks. built with TanStack Start"
      },
      {
        property: "og:type",
        content: "Website"
      },
      {
        property: "og:site_name",
        content: "Jude Tejada"
      },
      {
        property: "og:description",
        content: "Manage and save your bookmarks. built with TanStack Start"
      },
      {
        property: "og:title",
        content: "Quick Links"
      },
      {
        property: "og:image",
        content: "/assets/banner.png"
      },
      {
        property: "og:url",
        content: "https://quick-links-solid.vercel.app"
      },
      {
        name: "twitter:card",
        content: "summary_large_image"
      },
      {
        name: "twitter:site",
        content: "@JudeTejada2"
      },
      {
        name: "twitter:title",
        content: "Quick Links"
      },
      {
        name: "twitter:description",
        content: "Manage and save your bookmarks. built with TanStack Start"
      },
      {
        name: "twitter:image",
        content: "/assets/banner.png"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      },
      {
        rel: "shortcut icon",
        type: "image/ico",
        href: "/assets/logo/favicon.ico"
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/assets/logo/apple-touch-icon.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/assets/logo/favicon-32x32.png"
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/assets/logo/favicon-16x16.png"
      },
      {
        rel: "manifest",
        href: "/assets/logo/site.webmanifest"
      }
    ]
  }),
  shellComponent: RootDocument,
  notFoundComponent: Page404
});
function RootDocument({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ConvexAuthProvider, { client: convex, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ToastProvider, { position: "bottom-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "isolate relative flex min-h-svh flex-col", children }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$1 = () => import("./login-BJtlBlUJ.mjs");
const Route$1 = createFileRoute("/login")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-Dc1tcsgs.mjs");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const LoginRoute = Route$1.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$2
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$2
});
const rootRouteChildren = {
  IndexRoute,
  LoginRoute
};
const routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const router2 = createRouter({
    routeTree,
    context: {},
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  cn as c,
  router as r,
  toastManager as t
};
