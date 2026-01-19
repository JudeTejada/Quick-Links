import { r as reactExports, j as jsxRuntimeExports, a as React__default } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/@tanstack/react-router.mjs";
import { u as useAuthActions } from "../_libs/@convex-dev/auth.mjs";
import { f as useSensors, h as useSensor, D as DndContext, i as closestCenter, j as DragOverlay, k as KeyboardSensor, P as PointerSensor, u as useDndContext } from "../_libs/@dnd-kit/core.mjs";
import { S as SortableContext, v as verticalListSortingStrategy, a as arrayMove, s as sortableKeyboardCoordinates, u as useSortable, r as rectSortingStrategy } from "../_libs/@dnd-kit/sortable.mjs";
import { C as CSS } from "../_libs/@dnd-kit/utilities.mjs";
import { G as GripVertical, X, E as Ellipsis, b as Link2, c as Trash2 } from "../_libs/lucide-react.mjs";
import { n as notify$1, I as Input, F as Field, a as FieldLabel, b as FieldError } from "./input-fCQhDu6Q.mjs";
import { B as Button, c as cn } from "./router-tLPzzNbq.mjs";
import { u as useConvexAuth, c as useQuery, d as anyApi, e as useMutation, f as componentsGeneric } from "../_libs/convex.mjs";
import { P as PopoverRoot, A as AlertDialogRoot, M as MenuRoot, j as PopoverTrigger$1, k as PopoverPortal, l as PopoverPositioner, n as PopoverPopup$1, o as PopoverViewport, p as MenuTrigger$1, q as MenuPortal, r as MenuPositioner, s as MenuPopup$1, t as MenuItem$1, D as DialogPortal, v as DialogPopup, w as DialogTitle, x as DialogDescription, y as DialogClose, z as DialogBackdrop, B as DialogViewport } from "../_libs/@base-ui/react.mjs";
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
import "../_libs/@dnd-kit/accessibility.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_libs/@floating-ui/utils.mjs";
import "../_libs/tabbable.mjs";
import "../_libs/@floating-ui/react-dom.mjs";
import "../_libs/@floating-ui/dom.mjs";
import "../_libs/@floating-ui/core.mjs";
const api = anyApi;
componentsGeneric();
function useBookmark() {
  const { isAuthenticated } = useConvexAuth();
  const queryCategories = useQuery(api.bookmarks.listByUser, isAuthenticated ? {} : "skip");
  const categories = queryCategories ?? [];
  const isLoading = isAuthenticated && queryCategories === void 0;
  return { categories, isLoading };
}
const isUrl = (value) => {
  try {
    return Boolean(new URL(value));
  } catch {
    return false;
  }
};
function removeHttp(url) {
  return url.replace(/^https?:\/\//, "");
}
const Popover = PopoverRoot;
function PopoverTrigger(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger$1, { "data-slot": "popover-trigger", ...props });
}
function PopoverPopup({
  children,
  className,
  side = "bottom",
  align = "center",
  sideOffset = 4,
  alignOffset = 0,
  tooltipStyle = false,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    PopoverPositioner,
    {
      align,
      alignOffset,
      className: "z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom,transform] data-instant:transition-none",
      "data-slot": "popover-positioner",
      side,
      sideOffset,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        PopoverPopup$1,
        {
          className: cn(
            "relative flex h-(--popup-height,auto) w-(--popup-width,auto) origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding text-popover-foreground shadow-lg/5 transition-[width,height,scale,opacity] before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/6%)] data-starting-style:scale-98 data-starting-style:opacity-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            tooltipStyle && "w-fit text-balance rounded-md text-xs shadow-md/5 before:rounded-[calc(var(--radius-md)-1px)]",
            className
          ),
          "data-slot": "popover-popup",
          ...props,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            PopoverViewport,
            {
              className: cn(
                "relative size-full max-h-(--available-height) overflow-clip px-(--viewport-inline-padding) py-4 outline-none [--viewport-inline-padding:--spacing(4)] data-instant:transition-none **:data-current:data-ending-style:opacity-0 **:data-current:data-starting-style:opacity-0 **:data-previous:data-ending-style:opacity-0 **:data-previous:data-starting-style:opacity-0 **:data-current:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-previous:w-[calc(var(--popup-width)-2*var(--viewport-inline-padding)-2px)] **:data-current:opacity-100 **:data-previous:opacity-100 **:data-current:transition-opacity **:data-previous:transition-opacity",
                tooltipStyle ? "py-1 [--viewport-inline-padding:--spacing(2)]" : "not-data-transitioning:overflow-y-auto"
              ),
              "data-slot": "popover-viewport",
              children
            }
          )
        }
      )
    }
  ) });
}
const validateInput = (text, type) => {
  if (!text) return true;
  if (type === "bookmark" && !isUrl(text)) return true;
  return false;
};
const formatValue = (text, type) => {
  if (type === "bookmark") {
    const cleaned = text.replace(/^(https?:\/\/)+/i, "");
    return cleaned ? `https://${cleaned}` : "https://";
  }
  return text;
};
function QuickLinksInput({
  type,
  errorText,
  inputType = "text",
  label,
  text: initialText,
  placeholder,
  id,
  onFocus,
  onBlur,
  onSuccessHandler,
  inputRef
}) {
  const [text, setText] = reactExports.useState(initialText || (type === "bookmark" ? "https://" : ""));
  const [isError, setIsError] = reactExports.useState(false);
  const handleKeyDown = (event) => {
    if (event.key !== "Enter") return;
    const normalized = formatValue(text, type);
    const shouldError = validateInput(normalized, type);
    if (shouldError) {
      setIsError(true);
      return;
    }
    onSuccessHandler(normalized);
  };
  const handleInput = (event) => {
    setIsError(false);
    const inputValue = event.target.value;
    const formatted = formatValue(inputValue, type);
    setText(formatted);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Field, { children: [
    label ? /* @__PURE__ */ jsxRuntimeExports.jsx(FieldLabel, { htmlFor: id ?? label, children: label }) : null,
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        ref: inputRef,
        id: id ?? label,
        placeholder,
        type: inputType,
        value: text,
        onChange: handleInput,
        onKeyDown: handleKeyDown,
        onFocus,
        onBlur,
        "aria-invalid": isError
      }
    ),
    isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { children: errorText }) : null
  ] });
}
function CreateBookmark({ categoryId }) {
  const { isAuthenticated } = useConvexAuth();
  const createLink = useMutation(api.links.create);
  const inputRef = reactExports.useRef(null);
  const [isOpen, setIsOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);
  const handleEnter = async (text) => {
    if (!isAuthenticated) return;
    try {
      await createLink({
        url: text,
        categoryId
      });
      inputRef.current?.blur();
      setIsOpen(false);
    } catch (error) {
      notify$1({
        status: "danger",
        title: "Error!",
        description: error instanceof Error ? error.message : "Failed to add a new bookmark."
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverTrigger,
      {
        render: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "secondary",
            size: "xs",
            className: "h-6 rounded-md px-2.5 text-xs font-semibold text-slate-600 shadow-none hover:bg-slate-200",
            children: "New+"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverPopup, { side: "top", align: "start", className: "w-80", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      QuickLinksInput,
      {
        inputRef,
        errorText: "invalid url",
        type: "bookmark",
        placeholder: "https://www.google.com/",
        id: "category",
        inputType: "url",
        onSuccessHandler: handleEnter
      }
    ) })
  ] });
}
const getCategoryDragId = (categoryId) => `category:${categoryId}`;
const getLinkDragId = (linkId) => `link:${linkId}`;
function LinksList(props) {
  const items = reactExports.useMemo(
    () => props.list.map((bookmark) => getLinkDragId(bookmark._id)),
    [props.list]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SortableContext, { items, strategy: rectSortingStrategy, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-none flex min-h-[40px] flex-wrap items-center  gap-y-3 p-0", children: [
    props.list.map((bookmark) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      BookmarkLink,
      {
        ...bookmark,
        categoryId: props.categoryId,
        isLinksEditing: props.isLinksEditing
      },
      bookmark._id
    )),
    !props.isLinksEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreateBookmark, { categoryId: props.categoryId }) }) : null
  ] }) });
}
function BookmarkLink(props) {
  const [imageError, setImageError] = reactExports.useState(false);
  const { isAuthenticated } = useConvexAuth();
  const removeLink = useMutation(api.links.remove);
  const iconSizeClass = props.isLinksEditing ? "h-[34px] w-[34px]" : "h-6 w-6";
  const dragId = getLinkDragId(props._id);
  const { active } = useDndContext();
  const { setNodeRef, listeners: listeners2, attributes, transform, transition, isDragging, isOver } = useSortable({
    id: dragId,
    data: { type: "link", linkId: props._id, categoryId: props.categoryId }
  });
  const isLinkDrag = active?.data.current?.type === "link";
  const showInsert = isLinkDrag && isOver && active?.id !== dragId;
  const handleDeleteLink = async (linkId) => {
    if (!isAuthenticated) return;
    try {
      await removeLink({ linkId });
    } catch (error) {
      console.error(error);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "li",
    {
      ref: setNodeRef,
      style: {
        transform: CSS.Transform.toString(transform),
        transition
      },
      className: cn(
        "group relative rounded-full bg-slate-50/70 p-0.5 transition-[background-color,transform,opacity] duration-200",
        showInsert && "bg-sky-100 ring-2 ring-sky-300/50",
        isDragging && "opacity-30 scale-95"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "pointer-events-none absolute -top-2 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-sky-400/0 transition-all duration-200",
              showInsert && "bg-sky-400/90 scale-110"
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ...listeners2,
            ...attributes,
            className: "flex items-center rounded-full p-1 transition hover:bg-slate-100/80 cursor-grab active:cursor-grabbing",
            "aria-label": "Drag link",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: props.url, target: "_blank", rel: "noreferrer", className: "inline-flex items-center", children: !imageError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                className: `${iconSizeClass} rounded-full object-cover`,
                src: `https://icon.horse/icon/${removeHttp(props.url)}`,
                onError: () => setImageError(true),
                alt: props.url
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `${iconSizeClass} grid place-items-center rounded-full bg-black text-[10px] text-white`,
                children: "404"
              }
            ) })
          }
        ),
        props.isLinksEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "destructive",
            size: "icon-xs",
            className: "absolute -right-1 -top-1 h-4 w-4 rounded-full border-transparent p-0 text-white shadow-sm",
            "aria-label": "Delete current link",
            onClick: (event) => {
              event.stopPropagation();
              event.preventDefault();
              handleDeleteLink(props._id);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 10 })
          }
        ) : null
      ]
    }
  );
}
function CreateNewCategory() {
  const { isAuthenticated } = useConvexAuth();
  const createCategory = useMutation(api.bookmarks.create);
  const inputRef = reactExports.useRef(null);
  const [isOpen, setIsOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);
  const handleInputEnter = async (title) => {
    if (!isAuthenticated) return;
    try {
      await createCategory({
        title
      });
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: isOpen, onOpenChange: setIsOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverTrigger,
      {
        render: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "border-transparent bg-[#0EA5B7] text-white shadow-sm hover:bg-[#0B8EA0]", children: "Add new category" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverPopup, { side: "top", align: "start", className: "w-72", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      QuickLinksInput,
      {
        inputRef,
        placeholder: "Social",
        id: "category",
        errorText: "please enter a category",
        type: "category",
        onSuccessHandler: handleInputEnter
      }
    ) })
  ] });
}
const AlertDialog = AlertDialogRoot;
const AlertDialogPortal = DialogPortal;
function AlertDialogBackdrop({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogBackdrop,
    {
      className: cn(
        "fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      ),
      "data-slot": "alert-dialog-backdrop",
      ...props
    }
  );
}
function AlertDialogViewport({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogViewport,
    {
      className: cn(
        "fixed inset-0 z-50 grid grid-rows-[1fr_auto_3fr] justify-items-center p-4",
        className
      ),
      "data-slot": "alert-dialog-viewport",
      ...props
    }
  );
}
function AlertDialogPopup({
  className,
  bottomStickOnMobile = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogBackdrop, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AlertDialogViewport,
      {
        className: cn(bottomStickOnMobile && "max-sm:grid-rows-[1fr_auto] max-sm:p-0 max-sm:pt-12"),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DialogPopup,
          {
            className: cn(
              "-translate-y-[calc(1.25rem*var(--nested-dialogs))] relative row-start-2 flex max-h-full min-h-0 w-full min-w-0 max-w-lg scale-[calc(1-0.1*var(--nested-dialogs))] flex-col rounded-2xl border bg-popover not-dark:bg-clip-padding text-popover-foreground opacity-[calc(1-0.1*var(--nested-dialogs))] shadow-lg/5 transition-[scale,opacity,translate] duration-200 ease-in-out will-change-transform before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_--theme(--color-black/6%)] data-nested:data-ending-style:translate-y-8 data-nested:data-starting-style:translate-y-8 data-nested-dialog-open:origin-top data-ending-style:scale-98 data-starting-style:scale-98 data-ending-style:opacity-0 data-starting-style:opacity-0 dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
              bottomStickOnMobile && "max-sm:max-w-none max-sm:rounded-none max-sm:border-x-0 max-sm:border-t max-sm:border-b-0 max-sm:opacity-[calc(1-min(var(--nested-dialogs),1))] max-sm:data-ending-style:translate-y-4 max-sm:data-starting-style:translate-y-4 max-sm:before:hidden max-sm:before:rounded-none",
              className
            ),
            "data-slot": "alert-dialog-popup",
            ...props
          }
        )
      }
    )
  ] });
}
function AlertDialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn(
        "flex flex-col gap-2 p-6 not-has-[+[data-slot=alert-dialog-footer]]:pb-4 text-center max-sm:pb-4 sm:text-left",
        className
      ),
      "data-slot": "alert-dialog-header",
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn(
        "flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end sm:rounded-b-[calc(var(--radius-2xl)-1px)]",
        variant === "default" && "border-t bg-muted/72 py-4",
        variant === "bare" && "pt-4 pb-6",
        className
      ),
      "data-slot": "alert-dialog-footer",
      ...props
    }
  );
}
function AlertDialogTitle({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogTitle,
    {
      className: cn("font-heading text-xl leading-none", className),
      "data-slot": "alert-dialog-title",
      ...props
    }
  );
}
function AlertDialogDescription({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogDescription,
    {
      className: cn("text-muted-foreground text-sm", className),
      "data-slot": "alert-dialog-description",
      ...props
    }
  );
}
function AlertDialogClose(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { "data-slot": "alert-dialog-close", ...props });
}
const Menu = MenuRoot;
function MenuTrigger(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuTrigger$1, { "data-slot": "menu-trigger", ...props });
}
function MenuPopup({
  children,
  className,
  sideOffset = 4,
  align = "center",
  alignOffset,
  side = "bottom",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuPositioner,
    {
      align,
      alignOffset,
      className: "z-50",
      "data-slot": "menu-positioner",
      side,
      sideOffset,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuPopup$1,
        {
          className: cn(
            "relative flex not-[class*='w-']:min-w-32 origin-(--transform-origin) rounded-lg border bg-popover not-dark:bg-clip-padding shadow-lg/5 outline-none before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-[0_1px_--theme(--color-black/6%)] focus:outline-none dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            className
          ),
          "data-slot": "menu-popup",
          ...props,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-(--available-height) w-full overflow-y-auto p-1", children })
        }
      )
    }
  ) });
}
function MenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuItem$1,
    {
      className: cn(
        "[&>svg]:-mx-0.5 flex min-h-8 cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-base outline-none data-disabled:pointer-events-none data-highlighted:bg-accent data-inset:ps-8 data-[variant=destructive]:text-destructive-foreground data-highlighted:text-accent-foreground data-disabled:opacity-64 sm:min-h-7 sm:text-sm [&>svg:not([class*='opacity-'])]:opacity-80 [&>svg:not([class*='size-'])]:size-4.5 sm:[&>svg:not([class*='size-'])]:size-4 [&>svg]:pointer-events-none [&>svg]:shrink-0",
        className
      ),
      "data-inset": inset,
      "data-slot": "menu-item",
      "data-variant": variant,
      ...props
    }
  );
}
function CategoryPreferences(props) {
  const { isAuthenticated } = useConvexAuth();
  const removeCategory = useMutation(api.bookmarks.remove);
  const [isDialogOpen, setIsDialogOpen] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const handleDelete = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      await removeCategory({ categoryId: props.categoryId });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setIsDialogOpen(false);
    }
  };
  const handleLinksToggle = () => {
    props.onToggleLinksEdit(!props.isLinksEditing);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Menu, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuTrigger,
        {
          render: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon-xs",
              className: "h-6 w-6 rounded-md border-transparent shadow-none text-slate-400 hover:bg-slate-100 hover:text-slate-600",
              "aria-label": "Category options",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { size: 18 })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(MenuPopup, { align: "start", className: "min-w-[180px]", children: [
        props.links?.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs(MenuItem, { onClick: handleLinksToggle, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 16 }),
          props.isLinksEditing ? "Cancel edit links" : "Edit Links"
        ] }) : null,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(MenuItem, { variant: "destructive", onClick: () => setIsDialogOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 16 }),
          "Delete category"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogPopup, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
          'Are you sure you want to delete "',
          props.categoryTitle,
          '"?'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Deleting this means you won't be able to recover the content and its links." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogClose, { render: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleDelete, disabled: isLoading, children: isLoading ? "Deleting..." : "Confirm" })
      ] })
    ] })
  ] });
}
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn(
        "animate-skeleton rounded-sm [--skeleton-highlight:--alpha(var(--color-white)/64%)] [background:linear-gradient(120deg,transparent_40%,var(--skeleton-highlight),transparent_60%)_var(--color-muted)_0_0/200%_100%_fixed] dark:[--skeleton-highlight:--alpha(var(--color-white)/4%)]",
        className
      ),
      "data-slot": "skeleton",
      ...props
    }
  );
}
function BookmarkLoader() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-48 rounded-md" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-48 rounded-md" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full" })
      ] })
    ] })
  ] });
}
const normalizeCategories = (categories) => [...categories].sort((a, b) => (a.sortIndex ?? a.createdAt) - (b.sortIndex ?? b.createdAt)).map((category) => ({
  ...category,
  links: [...category.links].sort(
    (a, b) => (a.sortIndex ?? a.createdAt) - (b.sortIndex ?? b.createdAt)
  )
}));
const clampIndex = (value, max) => Math.max(0, Math.min(value, max));
function BookmarkCategories() {
  const { categories, isLoading } = useBookmark();
  const { isAuthenticated } = useConvexAuth();
  const reorderCategories = useMutation(api.bookmarks.reorder);
  const moveLink = useMutation(api.links.move);
  const reorderLinks = useMutation(api.links.reorder);
  const [draftCategories, setDraftCategories] = reactExports.useState(
    () => normalizeCategories(categories)
  );
  const [activeDrag, setActiveDrag] = reactExports.useState(null);
  const [linkOrigin, setLinkOrigin] = reactExports.useState(null);
  const [overCategoryId, setOverCategoryId] = reactExports.useState(null);
  const isDraggingRef = reactExports.useRef(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  reactExports.useEffect(() => {
    if (isDraggingRef.current) return;
    setDraftCategories(normalizeCategories(categories));
  }, [categories]);
  const categoryDragIds = reactExports.useMemo(
    () => draftCategories.map((category) => getCategoryDragId(category._id)),
    [draftCategories]
  );
  const linkPositionMap = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const category of draftCategories) {
      category.links.forEach((link, index) => {
        map.set(link._id, { categoryId: category._id, index });
      });
    }
    return map;
  }, [draftCategories]);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkLoader, {});
  }
  const findLinkPosition = (linkId) => linkPositionMap.get(linkId) ?? null;
  const updateCategoryOrder = (nextCategories) => nextCategories.map((category, index) => ({
    ...category,
    sortIndex: index
  }));
  const updateLinkOrder = (links) => links.map((link, index) => ({
    ...link,
    sortIndex: index
  }));
  const moveLinkInState = (current, linkId, fromCategoryId, toCategoryId, targetIndex) => {
    const sourceIndex = current.findIndex((category) => category._id === fromCategoryId);
    const destinationIndex = current.findIndex((category) => category._id === toCategoryId);
    if (sourceIndex === -1 || destinationIndex === -1) return current;
    const next = current.map((category) => ({
      ...category,
      links: [...category.links]
    }));
    const source = next[sourceIndex];
    const destination = next[destinationIndex];
    const linkIndex = source.links.findIndex((link2) => link2._id === linkId);
    if (linkIndex === -1) return current;
    const [link] = source.links.splice(linkIndex, 1);
    const insertIndex = clampIndex(targetIndex, destination.links.length);
    const movedLink = fromCategoryId === toCategoryId ? link : { ...link, categoryId: toCategoryId };
    destination.links.splice(insertIndex, 0, movedLink);
    source.links = updateLinkOrder(source.links);
    destination.links = updateLinkOrder(destination.links);
    return next;
  };
  const handleDragStart = ({ active }) => {
    const data = active.data.current;
    if (!data || !("type" in data)) return;
    isDraggingRef.current = true;
    setActiveDrag(data);
    setOverCategoryId(null);
    if (data.type === "link") {
      const origin = findLinkPosition(data.linkId);
      setLinkOrigin(origin ? { categoryId: origin.categoryId, index: origin.index } : null);
    } else {
      setLinkOrigin(null);
    }
  };
  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const activeData = active.data.current;
    const overData = over.data.current;
    if (!activeData || activeData.type !== "link" || !overData) return;
    const currentPosition = findLinkPosition(activeData.linkId);
    if (!currentPosition) return;
    const toCategoryId = overData.categoryId;
    setOverCategoryId(toCategoryId);
    const sourceCategoryId = currentPosition.categoryId;
    const targetCategory = draftCategories.find((category) => category._id === toCategoryId);
    if (!targetCategory) return;
    const overIndex = overData.type === "link" ? targetCategory.links.findIndex((link) => link._id === overData.linkId) : targetCategory.links.length;
    if (overIndex < 0) return;
    const isSameCategory = sourceCategoryId === toCategoryId;
    if (isSameCategory && currentPosition.index === overIndex) return;
    setDraftCategories(
      (prev) => moveLinkInState(prev, activeData.linkId, sourceCategoryId, toCategoryId, overIndex)
    );
  };
  const handleDragEnd = async ({ active, over }) => {
    isDraggingRef.current = false;
    setOverCategoryId(null);
    if (!over || !activeDrag || !isAuthenticated) {
      setDraftCategories(normalizeCategories(categories));
      setActiveDrag(null);
      setLinkOrigin(null);
      return;
    }
    const activeData = active.data.current;
    const overData = over.data.current;
    if (!activeData || !overData) {
      setDraftCategories(normalizeCategories(categories));
      setActiveDrag(null);
      setLinkOrigin(null);
      return;
    }
    if (activeData.type === "category" && overData.type === "category") {
      const activeIndex = draftCategories.findIndex(
        (category) => category._id === activeData.categoryId
      );
      const overIndex = draftCategories.findIndex(
        (category) => category._id === overData.categoryId
      );
      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
        setActiveDrag(null);
        return;
      }
      const reordered = updateCategoryOrder(arrayMove(draftCategories, activeIndex, overIndex));
      setDraftCategories(reordered);
      try {
        await reorderCategories({
          orderedIds: reordered.map((category) => category._id)
        });
        notify$1({ status: "success", title: "Category order updated" });
      } catch (error) {
        notify$1({
          status: "danger",
          title: "Error!",
          description: "Failed to reorder categories. Please try again."
        });
        setDraftCategories(normalizeCategories(categories));
      } finally {
        setActiveDrag(null);
        setLinkOrigin(null);
      }
      return;
    }
    if (activeData.type !== "link") {
      setActiveDrag(null);
      setLinkOrigin(null);
      return;
    }
    const finalPosition = findLinkPosition(activeData.linkId);
    if (!finalPosition || !linkOrigin) {
      setDraftCategories(normalizeCategories(categories));
      setActiveDrag(null);
      setLinkOrigin(null);
      return;
    }
    if (finalPosition.categoryId === linkOrigin.categoryId && finalPosition.index === linkOrigin.index) {
      setActiveDrag(null);
      setLinkOrigin(null);
      return;
    }
    try {
      if (finalPosition.categoryId !== linkOrigin.categoryId) {
        await moveLink({
          linkId: activeData.linkId,
          toCategoryId: finalPosition.categoryId,
          targetIndex: finalPosition.index
        });
        notify$1({ status: "success", title: "Link moved" });
      } else {
        const category = draftCategories.find((item) => item._id === finalPosition.categoryId);
        if (!category) {
          setActiveDrag(null);
          return;
        }
        await reorderLinks({
          categoryId: finalPosition.categoryId,
          orderedIds: category.links.map((link) => link._id)
        });
        notify$1({ status: "success", title: "Links reordered" });
      }
    } catch (error) {
      notify$1({
        status: "danger",
        title: "Error!",
        description: "Failed to move the link. Please try again."
      });
      setDraftCategories(normalizeCategories(categories));
    } finally {
      setActiveDrag(null);
      setLinkOrigin(null);
    }
  };
  const handleDragCancel = () => {
    isDraggingRef.current = false;
    setActiveDrag(null);
    setOverCategoryId(null);
    setLinkOrigin(null);
    setDraftCategories(normalizeCategories(categories));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DndContext,
    {
      sensors,
      collisionDetection: closestCenter,
      onDragStart: handleDragStart,
      onDragOver: handleDragOver,
      onDragEnd: handleDragEnd,
      onDragCancel: handleDragCancel,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SortableContext, { items: categoryDragIds, strategy: verticalListSortingStrategy, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-none space-y-8 p-0", children: [
          draftCategories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CategoryItem,
            {
              categoryId: category._id,
              title: category.title,
              links: category.links,
              isDropTarget: overCategoryId === category._id && activeDrag?.type === "link"
            },
            category._id
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreateNewCategory, {}) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DragOverlay, { children: [
          activeDrag?.type === "category" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            CategoryGhost,
            {
              title: draftCategories.find((category) => category._id === activeDrag.categoryId)?.title ?? ""
            }
          ) : null,
          activeDrag?.type === "link" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            LinkGhost,
            {
              url: draftCategories.flatMap((category) => category.links).find((link) => link._id === activeDrag.linkId)?.url ?? ""
            }
          ) : null
        ] })
      ]
    }
  );
}
function CategoryItem(props) {
  const { isAuthenticated } = useConvexAuth();
  const updateTitle = useMutation(api.bookmarks.updateTitle);
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [linksIsEditing, setLinksIsEditing] = reactExports.useState(false);
  const [draftTitle, setDraftTitle] = reactExports.useState(props.title);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const {
    setNodeRef,
    setActivatorNodeRef,
    listeners: listeners2,
    attributes,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: getCategoryDragId(props.categoryId),
    data: { type: "category", categoryId: props.categoryId }
  });
  reactExports.useEffect(() => {
    if (!props.links?.length && linksIsEditing) setLinksIsEditing(false);
  }, [linksIsEditing, props.links?.length]);
  reactExports.useEffect(() => {
    if (isEditing) {
      setDraftTitle(props.title);
      inputRef.current?.focus();
    }
  }, [isEditing, props.title]);
  reactExports.useEffect(() => {
    const handler = (event) => {
      if (event.key !== "Escape") return;
      if (isEditing) {
        setDraftTitle(props.title);
        setIsEditing(false);
      }
      if (linksIsEditing) setLinksIsEditing(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isEditing, linksIsEditing, props.title]);
  reactExports.useEffect(() => {
    if (!isEditing) {
      setDraftTitle(props.title);
    }
  }, [isEditing, props.title]);
  const commitTitle = async (text) => {
    if (!isAuthenticated) return;
    if (isSaving) return;
    const trimmedTitle = text.trim();
    if (!trimmedTitle) {
      notify$1({
        status: "danger",
        title: "Error!",
        description: "please enter a category"
      });
      return;
    }
    if (trimmedTitle === props.title) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await updateTitle({
        title: trimmedTitle,
        categoryId: props.categoryId
      });
      setIsEditing(false);
    } catch (error) {
      notify$1({
        status: "danger",
        title: "Error!",
        description: error instanceof Error ? error.message : "Failed to edit existing category title."
      });
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "li",
    {
      ref: setNodeRef,
      style: {
        transform: CSS.Transform.toString(transform),
        transition
      },
      className: cn(
        "group relative rounded-2xl px-3 py-3 transition-[background-color,transform,box-shadow] duration-200 hover:bg-slate-50",
        props.isDropTarget && "bg-sky-50/70 ring-2 ring-sky-300/50 ring-offset-2",
        isDragging && "opacity-40 scale-95"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                ref: setActivatorNodeRef,
                ...listeners2,
                ...attributes,
                className: "grid h-7 w-7 cursor-grab place-items-center rounded-full bg-slate-100 text-slate-400 opacity-70 transition group-hover:opacity-100 pointer-coarse:opacity-100 active:cursor-grabbing",
                "aria-label": "Drag category",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { size: 14 })
              }
            ),
            isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                ref: inputRef,
                nativeInput: true,
                className: "h-8 w-56 rounded-md border border-slate-200 bg-white px-2 text-xl font-semibold text-slate-900 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100",
                value: draftTitle,
                onChange: (event) => setDraftTitle(event.target.value),
                onKeyDown: (event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commitTitle(draftTitle);
                  }
                  if (event.key === "Escape") {
                    event.preventDefault();
                    setDraftTitle(props.title);
                    setIsEditing(false);
                  }
                },
                onBlur: () => commitTitle(draftTitle)
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "truncate text-xl font-semibold tracking-tight text-slate-900 transition-colors hover:text-slate-700",
                onClick: () => setIsEditing(true),
                children: props.title
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            linksIsEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon-xs",
                className: "h-6 w-6 rounded-full border-transparent text-slate-400 hover:bg-slate-100 hover:text-slate-600",
                "aria-label": "Stop editing links",
                onClick: () => setLinksIsEditing(false),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
              }
            ) : null,
            !isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              CategoryPreferences,
              {
                isLinksEditing: linksIsEditing,
                links: props.links,
                onToggleLinksEdit: setLinksIsEditing,
                categoryId: props.categoryId,
                categoryTitle: props.title
              }
            ) : null
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 ps-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          LinksList,
          {
            list: props.links,
            categoryId: props.categoryId,
            isLinksEditing: linksIsEditing
          }
        ) })
      ]
    }
  );
}
function CategoryGhost({ title }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-2xl border border-slate-200/60 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur-sm transition-transform duration-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-7 w-7 cursor-grabbing place-items-center rounded-full bg-slate-100 text-slate-500 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { size: 14 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-semibold text-slate-800", children: title || "Untitled" })
  ] });
}
function LinkGhost({ url }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-8 w-8 place-items-center rounded-full border border-slate-200/60 bg-white/95 shadow-xl backdrop-blur-sm transition-transform duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-7 w-7 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white shadow-sm", children: url ? url.slice(0, 2).toUpperCase() : "QL" }) });
}
const listeners = /* @__PURE__ */ new Set();
let isListening = false;
const notify = () => {
  for (const listener of listeners) {
    listener();
  }
};
const subscribe = (listener) => {
  listeners.add(listener);
  if (!isListening && typeof window !== "undefined") {
    isListening = true;
    window.addEventListener("online", notify);
    window.addEventListener("offline", notify);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && isListening && typeof window !== "undefined") {
      window.removeEventListener("online", notify);
      window.removeEventListener("offline", notify);
      isListening = false;
    }
  };
};
const getSnapshot = () => typeof navigator !== "undefined" ? navigator.onLine : true;
const getServerSnapshot = () => true;
function useOnlineStatus() {
  return reactExports.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
class ErrorBoundary extends React__default.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  reset = () => {
    this.setState({ error: null });
  };
  render() {
    if (this.state.error) {
      const fallback = typeof this.props.fallback === "function" ? this.props.fallback(this.state.error, this.reset) : this.props.fallback;
      return fallback ?? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Something went wrong" });
    }
    return this.props.children;
  }
}
function Home() {
  const {
    isLoading,
    isAuthenticated
  } = useConvexAuth();
  const {
    signOut
  } = useAuthActions();
  const user = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const navigate = useNavigate();
  const isLoadingUser = isAuthenticated && user === void 0;
  const isCheckingSession = isLoading || isLoadingUser;
  const isRedirecting = !isLoading && !isAuthenticated;
  const [isSigningOut, setIsSigningOut] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: "/login"
      });
    }
  }, [isAuthenticated, isLoading, navigate]);
  if (isCheckingSession || isRedirecting) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl rounded-2xl bg-white p-6 md:p-14", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-56 rounded-md" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32 rounded-md" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-24 rounded-md" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkLoader, {}) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl rounded-2xl bg-white p-6 md:p-14", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-3xl text-slate-900 md:text-4xl", children: "Quick Links" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-slate-500", children: user?.email ?? "Signed in" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", size: "sm", className: "border-transparent bg-[#0EA5B7] text-white shadow-sm hover:bg-[#0B8EA0]", onClick: () => {
        setIsSigningOut(true);
        void signOut();
      }, disabled: isSigningOut, "aria-label": "Sign out of your account", children: isSigningOut ? "Signing out..." : "Sign out" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkContent, {})
  ] }) });
}
function BookmarkContent() {
  const isOnline = useOnlineStatus();
  const [showRetry, setShowRetry] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => setShowRetry(false), 2e3);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowRetry(true), 0);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);
  if (!isOnline) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700", role: "alert", children: [
      "It appears you are not connected to the internet",
      showRetry && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => window.location.reload(), className: "ml-2 font-medium underline hover:no-underline", children: "Retry" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { fallback: (error, reset) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md bg-red-50 px-3 py-2 text-sm text-red-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Failed to load bookmarks" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: reset, className: "mt-2 font-medium underline hover:no-underline", children: "Try again" })
  ] }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkCategories, {}) }) });
}
export {
  Home as component
};
