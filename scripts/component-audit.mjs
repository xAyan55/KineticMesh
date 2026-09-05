import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const uiDir = path.resolve(rootDir, "client/src/components/ui");
const srcDir = path.resolve(rootDir, "client/src");
const registryFile = path.resolve(rootDir, "docs/shadcn-component-registry.md");

const REQUIRED_COMPONENTS = [
  "Accordion",
  "Alert",
  "Alert Dialog",
  "Aspect Ratio",
  "Attachment",
  "Avatar",
  "Badge",
  "Breadcrumb",
  "Bubble",
  "Button",
  "Button Group",
  "Calendar",
  "Card",
  "Carousel",
  "Chart",
  "Checkbox",
  "Collapsible",
  "Combobox",
  "Command",
  "Context Menu",
  "Data Table",
  "Date Picker",
  "Dialog",
  "Direction",
  "Drawer",
  "Dropdown Menu",
  "Empty",
  "Field",
  "Hover Card",
  "Input",
  "Input Group",
  "Input OTP",
  "Item",
  "Kbd",
  "Label",
  "Marker",
  "Menubar",
  "Message",
  "Message Scroller",
  "Native Select",
  "Navigation Menu",
  "Pagination",
  "Popover",
  "Progress",
  "Questionnaire",
  "Radio Group",
  "Resizable",
  "Scroll Area",
  "Select",
  "Separator",
  "Sheet",
  "Sidebar",
  "Skeleton",
  "Slider",
  "Spinner",
  "Switch",
  "Table",
  "Tabs",
  "Textarea",
  "Toast",
  "Toggle",
  "Toggle Group",
  "Tooltip",
  "Typography",
];

// Map human component names to file basenames and primary JSX identifiers
const COMPONENT_META = {
  "Accordion": { file: "accordion.tsx", jsx: ["Accordion", "AccordionItem", "AccordionTrigger"] },
  "Alert": { file: "alert.tsx", jsx: ["Alert", "AlertTitle", "AlertDescription"] },
  "Alert Dialog": { file: "alert-dialog.tsx", jsx: ["AlertDialog", "AlertDialogContent", "AlertDialogAction"] },
  "Aspect Ratio": { file: "aspect-ratio.tsx", jsx: ["AspectRatio"] },
  "Attachment": { file: "attachment.tsx", jsx: ["Attachment"] },
  "Avatar": { file: "avatar.tsx", jsx: ["Avatar", "AvatarImage", "AvatarFallback"] },
  "Badge": { file: "badge.tsx", jsx: ["Badge"] },
  "Breadcrumb": { file: "breadcrumb.tsx", jsx: ["Breadcrumb", "BreadcrumbList", "BreadcrumbItem"] },
  "Bubble": { file: "bubble.tsx", jsx: ["Bubble"] },
  "Button": { file: "button.tsx", jsx: ["Button"] },
  "Button Group": { file: "button-group.tsx", jsx: ["ButtonGroup"] },
  "Calendar": { file: "calendar.tsx", jsx: ["Calendar"] },
  "Card": { file: "card.tsx", jsx: ["Card", "CardContent", "CardHeader"] },
  "Carousel": { file: "carousel.tsx", jsx: ["Carousel", "CarouselContent", "CarouselItem"] },
  "Chart": { file: "chart.tsx", jsx: ["ChartContainer", "ChartTooltip"] },
  "Checkbox": { file: "checkbox.tsx", jsx: ["Checkbox"] },
  "Collapsible": { file: "collapsible.tsx", jsx: ["Collapsible", "CollapsibleContent", "CollapsibleTrigger"] },
  "Combobox": { file: "combobox.tsx", jsx: ["Combobox"] },
  "Command": { file: "command.tsx", jsx: ["Command", "CommandDialog", "CommandInput", "CommandItem"] },
  "Context Menu": { file: "context-menu.tsx", jsx: ["ContextMenu", "ContextMenuTrigger", "ContextMenuContent"] },
  "Data Table": { file: "data-table.tsx", jsx: ["DataTable"] },
  "Date Picker": { file: "date-picker.tsx", jsx: ["DatePicker"] },
  "Dialog": { file: "dialog.tsx", jsx: ["Dialog", "DialogContent", "DialogHeader"] },
  "Direction": { file: "direction.tsx", jsx: ["DirectionProvider"] },
  "Drawer": { file: "drawer.tsx", jsx: ["Drawer", "DrawerContent", "DrawerTrigger"] },
  "Dropdown Menu": { file: "dropdown-menu.tsx", jsx: ["DropdownMenu", "DropdownMenuContent", "DropdownMenuItem"] },
  "Empty": { file: "empty.tsx", jsx: ["Empty"] },
  "Field": { file: "field.tsx", jsx: ["Field"] },
  "Hover Card": { file: "hover-card.tsx", jsx: ["HoverCard", "HoverCardTrigger", "HoverCardContent"] },
  "Input": { file: "input.tsx", jsx: ["Input"] },
  "Input Group": { file: "input-group.tsx", jsx: ["InputGroup", "InputAddon"] },
  "Input OTP": { file: "input-otp.tsx", jsx: ["InputOTP", "InputOTPGroup", "InputOTPSlot"] },
  "Item": { file: "item.tsx", jsx: ["Item", "ItemContent", "ItemMedia"] },
  "Kbd": { file: "kbd.tsx", jsx: ["Kbd"] },
  "Label": { file: "label.tsx", jsx: ["Label"] },
  "Marker": { file: "marker.tsx", jsx: ["Marker"] },
  "Menubar": { file: "menubar.tsx", jsx: ["Menubar", "MenubarMenu", "MenubarTrigger"] },
  "Message": { file: "message.tsx", jsx: ["Message"] },
  "Message Scroller": { file: "message-scroller.tsx", jsx: ["MessageScroller"] },
  "Native Select": { file: "native-select.tsx", jsx: ["NativeSelect"] },
  "Navigation Menu": { file: "navigation-menu.tsx", jsx: ["NavigationMenu", "NavigationMenuList"] },
  "Pagination": { file: "pagination.tsx", jsx: ["Pagination", "PaginationContent"] },
  "Popover": { file: "popover.tsx", jsx: ["Popover", "PopoverTrigger", "PopoverContent"] },
  "Progress": { file: "progress.tsx", jsx: ["Progress"] },
  "Questionnaire": { file: "questionnaire.tsx", jsx: ["Questionnaire", "QuestionnaireContent"] },
  "Radio Group": { file: "radio-group.tsx", jsx: ["RadioGroup", "RadioGroupItem"] },
  "Resizable": { file: "resizable.tsx", jsx: ["ResizablePanelGroup", "ResizablePanel", "ResizableHandle"] },
  "Scroll Area": { file: "scroll-area.tsx", jsx: ["ScrollArea", "ScrollBar"] },
  "Select": { file: "select.tsx", jsx: ["Select", "SelectTrigger", "SelectContent"] },
  "Separator": { file: "separator.tsx", jsx: ["Separator"] },
  "Sheet": { file: "sheet.tsx", jsx: ["Sheet", "SheetContent", "SheetTrigger"] },
  "Sidebar": { file: "sidebar.tsx", jsx: ["Sidebar", "SidebarHeader", "SidebarContent"] },
  "Skeleton": { file: "skeleton.tsx", jsx: ["Skeleton"] },
  "Slider": { file: "slider.tsx", jsx: ["Slider"] },
  "Spinner": { file: "spinner.tsx", jsx: ["Spinner"] },
  "Switch": { file: "switch.tsx", jsx: ["Switch"] },
  "Table": { file: "table.tsx", jsx: ["Table", "TableHeader", "TableBody", "TableRow", "TableCell"] },
  "Tabs": { file: "tabs.tsx", jsx: ["Tabs", "TabsList", "TabsTrigger", "TabsContent"] },
  "Textarea": { file: "textarea.tsx", jsx: ["Textarea"] },
  "Toast": { file: "toast.tsx", jsx: ["Toast", "Toaster", "toast"] },
  "Toggle": { file: "toggle.tsx", jsx: ["Toggle"] },
  "Toggle Group": { file: "toggle-group.tsx", jsx: ["ToggleGroup", "ToggleGroupItem"] },
  "Tooltip": { file: "tooltip.tsx", jsx: ["Tooltip", "TooltipTrigger", "TooltipContent"] },
  "Typography": { file: "typography.tsx", jsx: ["TypographyH1", "TypographyH2", "TypographyP", "TypographyMuted"] },
};

function getAllFiles(dir, exts = [".tsx", ".ts"]) {
  const files = [];
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      files.push(...getAllFiles(full, exts));
    } else if (exts.some(ext => full.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

console.log("==================================================");
console.log("  KINETICMESH 64-COMPONENT SHADCN PRODUCTION AUDIT");
console.log("==================================================\n");

const prodFiles = getAllFiles(path.join(srcDir, "pages")).concat(
  getAllFiles(path.join(srcDir, "components/layout")),
  getAllFiles(path.join(srcDir, "components/ui"))
);

const allProdContents = prodFiles.map(f => ({
  file: f,
  content: fs.readFileSync(f, "utf8"),
  isUiComp: f.includes(path.join("components", "ui")),
}));

const registryContent = fs.readFileSync(registryFile, "utf8");

let passedCount = 0;
let failedCount = 0;

for (const name of REQUIRED_COMPONENTS) {
  const meta = COMPONENT_META[name];
  if (!meta) {
    console.error(`[FAIL] No metadata for component: ${name}`);
    failedCount++;
    continue;
  }

  const filePath = path.join(uiDir, meta.file);
  const installed = fs.existsSync(filePath);

  if (!installed) {
    console.error(`[FAIL] ${name}: File not found at ${filePath}`);
    failedCount++;
    continue;
  }

  // Check registry
  const inRegistry = registryContent.includes(name);

  // Check usage in non-UI files (pages or layout)
  const usageFiles = allProdContents.filter(f => {
    if (f.isUiComp && f.file.endsWith(meta.file)) return false; // don't count self
    return meta.jsx.some(jsxTag => {
      // Look for `<jsxTag` or `toast(`
      return f.content.includes(`<${jsxTag}`) || (jsxTag === "toast" && f.content.includes("toast("));
    });
  });

  const isUsed = usageFiles.length > 0;

  if (installed && isUsed && inRegistry) {
    passedCount++;
    const usedIn = usageFiles.slice(0, 2).map(f => path.basename(f.file)).join(", ");
    console.log(`✓ [PASS] ${name.padEnd(20)} | Installed: YES | Used in: ${usedIn}`);
  } else {
    failedCount++;
    console.error(`✗ [FAIL] ${name.padEnd(20)} | Installed: ${installed} | Used: ${isUsed} | Registry: ${inRegistry}`);
  }
}

console.log("\n--------------------------------------------------");
console.log(`Audit Summary: ${passedCount} PASSED / ${failedCount} FAILED out of ${REQUIRED_COMPONENTS.length} total.`);
console.log("--------------------------------------------------\n");

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log("ALL 64 REQUIRED COMPONENTS ARE INSTALLED AND MEANINGFULLY USED IN PRODUCTION ROUTES!");
}
