var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf, __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: !0 });
}, __copyProps = (to, from, except, desc) => {
  if (from && typeof from == "object" || typeof from == "function")
    for (let key of __getOwnPropNames(from))
      !__hasOwnProp.call(to, key) && key !== except && __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: !0 }) : target,
  mod
)), __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: !0 }), mod);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  assetsBuildDirectory: () => assetsBuildDirectory,
  entry: () => entry,
  future: () => future,
  publicPath: () => publicPath,
  routes: () => routes
});
module.exports = __toCommonJS(stdin_exports);

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_node_stream = require("stream"), import_node = require("@remix-run/node"), import_react = require("@remix-run/react"), import_isbot = __toESM(require("isbot")), import_server = require("react-dom/server"), import_jsx_runtime = require("react/jsx-runtime"), ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return (0, import_isbot.default)(request.headers.get("user-agent")) ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react.RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          let body = new import_node_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500, console.error(error);
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let { pipe, abort } = (0, import_server.renderToPipeableStream)(
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_react.RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          let body = new import_node_stream.PassThrough();
          responseHeaders.set("Content-Type", "text/html"), resolve(
            new import_node.Response(body, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          ), pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          console.error(error), responseStatusCode = 500;
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}

// app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader
});
var import_node3 = require("@remix-run/node"), import_react2 = require("@remix-run/react");

// app/styles/tailwind.css
var tailwind_default = "/build/_assets/tailwind-MC4ZU67L.css";

// app/session.server.ts
var import_node2 = require("@remix-run/node"), import_tiny_invariant = __toESM(require("tiny-invariant"));

// app/models/user.server.ts
var import_bcryptjs = __toESM(require("bcryptjs"));

// app/db.server.ts
var import_client = require("@prisma/client"), prisma;
prisma = new import_client.PrismaClient();

// app/models/user.server.ts
async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
async function createUser(email, password) {
  let hashedPassword = await import_bcryptjs.default.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });
}
async function verifyLogin(email, password) {
  let userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: !0
    }
  });
  if (!userWithPassword || !userWithPassword.password || !await import_bcryptjs.default.compare(
    password,
    userWithPassword.password.hash
  ))
    return null;
  let { password: _password, ...userWithoutPassword } = userWithPassword;
  return userWithoutPassword;
}

// app/session.server.ts
(0, import_tiny_invariant.default)(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
var sessionStorage = (0, import_node2.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    httpOnly: !0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: !0
  }
}), USER_SESSION_KEY = "userId";
async function getSession(request) {
  let cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
async function getUserId(request) {
  return (await getSession(request)).get(USER_SESSION_KEY);
}
async function getUser(request) {
  let userId = await getUserId(request);
  if (userId === void 0)
    return null;
  let user = await getUserById(userId);
  if (user)
    return user;
  throw await logout(request);
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  let userId = await getUserId(request);
  if (!userId) {
    let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw (0, import_node2.redirect)(`/login?${searchParams}`);
  }
  return userId;
}
async function createUserSession({
  request,
  userId,
  remember,
  redirectTo
}) {
  let session = await getSession(request);
  return session.set(USER_SESSION_KEY, userId), (0, import_node2.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : void 0
      })
    }
  });
}
async function logout(request) {
  let session = await getSession(request);
  return (0, import_node2.redirect)("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}

// app/root.tsx
var import_jsx_runtime2 = require("react/jsx-runtime"), links = () => [{ rel: "stylesheet", href: tailwind_default }];
async function loader({ request }) {
  return (0, import_node3.json)({
    user: await getUser(request)
  });
}
function App() {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("html", { lang: "en", className: "dark h-full", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("head", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("meta", { name: "viewport", content: "width=device-width,initial-scale=1" }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Meta, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Links, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("body", { className: "relative h-full dark:bg-gray-800", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Outlet, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.ScrollRestoration, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.Scripts, {}),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(import_react2.LiveReload, {})
    ] })
  ] });
}

// app/routes/_index.tsx
var index_exports = {};
__export(index_exports, {
  default: () => Index,
  meta: () => meta
});
var import_react5 = require("@remix-run/react"), import_flowbite_react = require("flowbite-react");

// app/utils.ts
var import_react3 = require("@remix-run/react"), import_react4 = require("react"), DEFAULT_REDIRECT = "/";
function safeRedirect(to, defaultRedirect = DEFAULT_REDIRECT) {
  return !to || typeof to != "string" || !to.startsWith("/") || to.startsWith("//") ? defaultRedirect : to;
}
function useMatchesData(id) {
  let matchingRoutes = (0, import_react3.useMatches)(), route = (0, import_react4.useMemo)(
    () => matchingRoutes.find((route2) => route2.id === id),
    [matchingRoutes, id]
  );
  return route == null ? void 0 : route.data;
}
function isUser(user) {
  return user && typeof user == "object" && typeof user.email == "string";
}
function useOptionalUser() {
  let data = useMatchesData("root");
  if (!(!data || !isUser(data.user)))
    return data.user;
}
function useUser() {
  let maybeUser = useOptionalUser();
  if (!maybeUser)
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead."
    );
  return maybeUser;
}
function validateEmail(email) {
  return typeof email == "string" && email.length > 3 && email.includes("@");
}

// app/routes/_index.tsx
var import_ri = require("react-icons/ri"), import_react6 = require("react"), import_jsx_runtime3 = require("react/jsx-runtime"), meta = () => [{ title: "Remix Notes" }];
function Index() {
  let [collapsed, setCollapsed] = (0, import_react6.useState)(!0), user = useOptionalUser();
  function onPageChange() {
  }
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      import_flowbite_react.Navbar,
      {
        fluid: !0,
        rounded: !0,
        className: " fixed left-0 right-0 top-0 z-20",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_flowbite_react.Navbar.Brand, { href: "#", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "text-white", onClick: () => setCollapsed(!collapsed), children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_ri.RiMenu3Line, { className: "text-lg font-bold " }) }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              "img",
              {
                src: "icons8-doggy-51.png",
                className: "mr-3 h-6 sm:h-9",
                alt: "HookMeUp"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "self-center whitespace-nowrap text-xl font-semibold dark:text-white", children: "HookMeUp" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "flex gap-4 md:order-2", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
            import_flowbite_react.Dropdown,
            {
              arrowIcon: !1,
              inline: !0,
              label: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                import_flowbite_react.Avatar,
                {
                  alt: "User settings",
                  img: "https://flowbite.com/docs/images/people/profile-picture-5.jpg",
                  rounded: !0
                }
              ),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_flowbite_react.Dropdown.Header, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "block text-sm", children: "Bonnie Green" }),
                  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("span", { className: "block truncate text-sm font-medium", children: "name@flowbite.com" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_flowbite_react.Dropdown.Item, { children: "Dashboard" }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_flowbite_react.Dropdown.Item, { children: "Settings" }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_flowbite_react.Dropdown.Item, { children: "Earnings" }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_flowbite_react.Dropdown.Divider, {}),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_flowbite_react.Dropdown.Item, { children: "Sign out" })
              ]
            }
          ) })
        ]
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex", children: [
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "fixed z-10 w-fit", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        import_flowbite_react.Sidebar,
        {
          collapsed,
          hidden: collapsed,
          "aria-label": "Default sidebar example",
          children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_flowbite_react.Sidebar.Items, { children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_flowbite_react.Sidebar.ItemGroup, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_flowbite_react.Sidebar.Item, { href: "#", icon: import_ri.RiPhoneFill, children: "Dashboard" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
              import_flowbite_react.Sidebar.Item,
              {
                href: "#",
                icon: import_ri.RiPhoneFill,
                label: "Pro",
                labelColor: "alternative",
                children: "Kanban"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_flowbite_react.Sidebar.Item, { href: "#", icon: import_ri.RiPhoneFill, label: "3", children: "Inbox" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_flowbite_react.Sidebar.Item, { href: "#", icon: import_ri.RiPhoneFill, children: "Users" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_flowbite_react.Sidebar.Item, { href: "#", icon: import_ri.RiPhoneFill, children: "Products" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_flowbite_react.Sidebar.Item, { href: "#", icon: import_ri.RiPhoneFill, children: "Sign In" }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_flowbite_react.Sidebar.Item, { href: "#", icon: import_ri.RiPhoneFill, children: "Sign Up" })
          ] }) })
        }
      ) }),
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("main", { className: "relative min-h-screen  sm:flex sm:items-center sm:justify-center ", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "relative sm:pb-16 sm:pt-8", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "mx-auto max-w-7xl px-1 py-2 sm:px-2 lg:px-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "... mt-3 flex flex-wrap justify-center gap-4 ", children: [
          {
            src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
            alt: "Fly.io",
            name: "Mimi Baby",
            location: "Ikeja, Lagos",
            href: "https://fly.io"
          },
          {
            src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
            alt: "SQLite",
            href: "https://sqlite.org"
          },
          {
            src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
            alt: "Prisma",
            href: "https://prisma.io"
          },
          {
            src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
            alt: "Tailwind",
            href: "https://tailwindcss.com"
          },
          {
            src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
            alt: "Cypress",
            href: "https://www.cypress.io"
          },
          {
            src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
            alt: "MSW",
            href: "https://mswjs.io"
          },
          {
            src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
            alt: "Vitest",
            href: "https://vitest.dev"
          },
          {
            src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
            alt: "Testing Library",
            href: "https://testing-library.com"
          },
          {
            src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
            alt: "Prettier",
            href: "https://prettier.io"
          },
          {
            src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
            alt: "ESLint",
            href: "https://eslint.org"
          },
          {
            src: "https://api.codedruns.com/uploads/1678954762711Screenshot_20230316-090334_WhatsAppBusiness.jpg",
            alt: "TypeScript",
            href: "https://typescriptlang.org"
          }
        ].map((img) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "max-w-sm", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_flowbite_react.Card, { className: "grid  justify-center p-1 transition hover:grayscale-0 focus:grayscale-0", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "object-contain", children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "img",
            {
              alt: img.alt,
              src: img.src,
              className: "rounded-xl object-contain"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("h6", { className: "text-2xl font-bold tracking-tight text-gray-900 dark:text-white", children: img.name }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "font-normal text-green-400", children: "Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order." }),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex flex-wrap gap-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex flex-wrap gap-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_ri.RiPhoneFill, { className: "mt-1.5 text-white" }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "text-white", children: "+234749485653" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "flex flex-wrap gap-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_ri.RiMapPin2Fill, { className: "mt-1.5 text-white" }),
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("p", { className: "text-white", children: img.location })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_react5.Link, { to: img.href, children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(import_flowbite_react.Button, { className: "mt-1", children: "View Profile" }) })
          ] })
        ] }) }) }, img.href)) }),
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
          import_flowbite_react.Pagination,
          {
            className: "justify-center",
            currentPage: 1,
            onPageChange,
            showIcons: !0,
            totalPages: 100
          }
        )
      ] }) }) })
    ] })
  ] });
}

// app/routes/healthcheck.tsx
var healthcheck_exports = {};
__export(healthcheck_exports, {
  loader: () => loader2
});
async function loader2({ request }) {
  let host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  try {
    let url = new URL("/", `http://${host}`);
    return await Promise.all([
      prisma.user.count(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok)
          return Promise.reject(r);
      })
    ]), new Response("OK");
  } catch (error) {
    return console.log("healthcheck \u274C", { error }), new Response("ERROR", { status: 500 });
  }
}

// app/routes/join.tsx
var join_exports = {};
__export(join_exports, {
  action: () => action,
  default: () => Join,
  loader: () => loader3,
  meta: () => meta2
});
var import_node4 = require("@remix-run/node"), import_react7 = require("@remix-run/react"), React = __toESM(require("react"));
var import_jsx_runtime4 = require("react/jsx-runtime");
async function loader3({ request }) {
  return await getUserId(request) ? (0, import_node4.redirect)("/") : (0, import_node4.json)({});
}
async function action({ request }) {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  if (!validateEmail(email))
    return (0, import_node4.json)(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  if (typeof password != "string" || password.length === 0)
    return (0, import_node4.json)(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  if (password.length < 8)
    return (0, import_node4.json)(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  if (await getUserByEmail(email))
    return (0, import_node4.json)(
      {
        errors: {
          email: "A user already exists with this email",
          password: null
        }
      },
      { status: 400 }
    );
  let user = await createUser(email, password);
  return createUserSession({
    request,
    userId: user.id,
    remember: !1,
    redirectTo
  });
}
var meta2 = () => [{ title: "Sign Up" }];
function Join() {
  var _a, _b, _c, _d;
  let [searchParams] = (0, import_react7.useSearchParams)(), redirectTo = searchParams.get("redirectTo") ?? void 0, actionData = (0, import_react7.useActionData)(), emailRef = React.useRef(null), passwordRef = React.useRef(null);
  return React.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.email ? (_b2 = emailRef.current) == null || _b2.focus() : (_c2 = actionData == null ? void 0 : actionData.errors) != null && _c2.password && ((_d2 = passwordRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "flex min-h-full flex-col justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "mx-auto w-full max-w-md px-8", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_react7.Form, { method: "post", className: "space-y-6", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "label",
        {
          htmlFor: "email",
          className: "block text-sm font-medium text-gray-700",
          children: "Email address"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "mt-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "input",
          {
            ref: emailRef,
            id: "email",
            required: !0,
            autoFocus: !0,
            name: "email",
            type: "email",
            autoComplete: "email",
            "aria-invalid": (_a = actionData == null ? void 0 : actionData.errors) != null && _a.email ? !0 : void 0,
            "aria-describedby": "email-error",
            className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
          }
        ),
        ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "pt-1 text-red-700", id: "email-error", children: actionData.errors.email })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        "label",
        {
          htmlFor: "password",
          className: "block text-sm font-medium text-gray-700",
          children: "Password"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "mt-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "input",
          {
            id: "password",
            ref: passwordRef,
            name: "password",
            type: "password",
            autoComplete: "new-password",
            "aria-invalid": (_c = actionData == null ? void 0 : actionData.errors) != null && _c.password ? !0 : void 0,
            "aria-describedby": "password-error",
            className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
          }
        ),
        ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "pt-1 text-red-700", id: "password-error", children: actionData.errors.password })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("input", { type: "hidden", name: "redirectTo", value: redirectTo }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "button",
      {
        type: "submit",
        className: "w-full rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400",
        children: "Create Account"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "text-center text-sm text-gray-500", children: [
      "Already have an account?",
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        import_react7.Link,
        {
          className: "text-blue-500 underline",
          to: {
            pathname: "/login",
            search: searchParams.toString()
          },
          children: "Log in"
        }
      )
    ] }) })
  ] }) }) });
}

// app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action2,
  default: () => LoginPage,
  loader: () => loader4,
  meta: () => meta3
});
var import_node5 = require("@remix-run/node"), import_react8 = require("@remix-run/react"), React2 = __toESM(require("react"));
var import_jsx_runtime5 = require("react/jsx-runtime");
async function loader4({ request }) {
  return await getUserId(request) ? (0, import_node5.redirect)("/") : (0, import_node5.json)({});
}
async function action2({ request }) {
  let formData = await request.formData(), email = formData.get("email"), password = formData.get("password"), redirectTo = safeRedirect(formData.get("redirectTo"), "/notes"), remember = formData.get("remember");
  if (!validateEmail(email))
    return (0, import_node5.json)(
      { errors: { email: "Email is invalid", password: null } },
      { status: 400 }
    );
  if (typeof password != "string" || password.length === 0)
    return (0, import_node5.json)(
      { errors: { email: null, password: "Password is required" } },
      { status: 400 }
    );
  if (password.length < 8)
    return (0, import_node5.json)(
      { errors: { email: null, password: "Password is too short" } },
      { status: 400 }
    );
  let user = await verifyLogin(email, password);
  return user ? createUserSession({
    request,
    userId: user.id,
    remember: remember === "on",
    redirectTo
  }) : (0, import_node5.json)(
    { errors: { email: "Invalid email or password", password: null } },
    { status: 400 }
  );
}
var meta3 = () => [{ title: "Login" }];
function LoginPage() {
  var _a, _b, _c, _d;
  let [searchParams] = (0, import_react8.useSearchParams)(), redirectTo = searchParams.get("redirectTo") || "/notes", actionData = (0, import_react8.useActionData)(), emailRef = React2.useRef(null), passwordRef = React2.useRef(null);
  return React2.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.email ? (_b2 = emailRef.current) == null || _b2.focus() : (_c2 = actionData == null ? void 0 : actionData.errors) != null && _c2.password && ((_d2 = passwordRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "flex min-h-full flex-col justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "mx-auto w-full max-w-md px-8", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_react8.Form, { method: "post", className: "space-y-6", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "label",
        {
          htmlFor: "email",
          className: "block text-sm font-medium text-gray-700",
          children: "Email address"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "mt-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "input",
          {
            ref: emailRef,
            id: "email",
            required: !0,
            autoFocus: !0,
            name: "email",
            type: "email",
            autoComplete: "email",
            "aria-invalid": (_a = actionData == null ? void 0 : actionData.errors) != null && _a.email ? !0 : void 0,
            "aria-describedby": "email-error",
            className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
          }
        ),
        ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "pt-1 text-red-700", id: "email-error", children: actionData.errors.email })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
        "label",
        {
          htmlFor: "password",
          className: "block text-sm font-medium text-gray-700",
          children: "Password"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "mt-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "input",
          {
            id: "password",
            ref: passwordRef,
            name: "password",
            type: "password",
            autoComplete: "current-password",
            "aria-invalid": (_c = actionData == null ? void 0 : actionData.errors) != null && _c.password ? !0 : void 0,
            "aria-describedby": "password-error",
            className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
          }
        ),
        ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "pt-1 text-red-700", id: "password-error", children: actionData.errors.password })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("input", { type: "hidden", name: "redirectTo", value: redirectTo }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "button",
      {
        type: "submit",
        className: "w-full rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400",
        children: "Log in"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "input",
          {
            id: "remember",
            name: "remember",
            type: "checkbox",
            className: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          "label",
          {
            htmlFor: "remember",
            className: "ml-2 block text-sm text-gray-900",
            children: "Remember me"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "text-center text-sm text-gray-500", children: [
        "Don't have an account?",
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
          import_react8.Link,
          {
            className: "text-blue-500 underline",
            to: {
              pathname: "/join",
              search: searchParams.toString()
            },
            children: "Sign up"
          }
        )
      ] })
    ] })
  ] }) }) });
}

// app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action3,
  loader: () => loader5
});
var import_node6 = require("@remix-run/node");
async function action3({ request }) {
  return logout(request);
}
async function loader5() {
  return (0, import_node6.redirect)("/");
}

// app/routes/notes.tsx
var notes_exports = {};
__export(notes_exports, {
  default: () => NotesPage,
  loader: () => loader6
});
var import_node7 = require("@remix-run/node"), import_react9 = require("@remix-run/react");

// app/models/note.server.ts
function getNote({
  id,
  userId
}) {
  return prisma.note.findFirst({
    select: { id: !0, body: !0, title: !0 },
    where: { id, userId }
  });
}
function getNoteListItems({ userId }) {
  return prisma.note.findMany({
    where: { userId },
    select: { id: !0, title: !0 },
    orderBy: { updatedAt: "desc" }
  });
}
function createNote({
  body,
  title,
  userId
}) {
  return prisma.note.create({
    data: {
      title,
      body,
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
}
function deleteNote({
  id,
  userId
}) {
  return prisma.note.deleteMany({
    where: { id, userId }
  });
}

// app/routes/notes.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
async function loader6({ request }) {
  let userId = await requireUserId(request), noteListItems = await getNoteListItems({ userId });
  return (0, import_node7.json)({ noteListItems });
}
function NotesPage() {
  let data = (0, import_react9.useLoaderData)(), user = useUser();
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex h-full min-h-screen flex-col", children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("header", { className: "flex items-center justify-between bg-slate-800 p-4 text-white", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("h1", { className: "text-3xl font-bold", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react9.Link, { to: ".", children: "Notes" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { children: user.email }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react9.Form, { action: "/logout", method: "post", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
        "button",
        {
          type: "submit",
          className: "rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600",
          children: "Logout"
        }
      ) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("main", { className: "flex h-full bg-white", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "h-full w-80 border-r bg-gray-50", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react9.Link, { to: "new", className: "block p-4 text-xl text-blue-500", children: "+ New Note" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("hr", {}),
        data.noteListItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("p", { className: "p-4", children: "No notes yet" }) : /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("ol", { children: data.noteListItems.map((note) => /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          import_react9.NavLink,
          {
            className: ({ isActive }) => `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`,
            to: note.id,
            children: [
              "\u{1F4DD} ",
              note.title
            ]
          }
        ) }, note.id)) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "flex-1 p-6", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_react9.Outlet, {}) })
    ] })
  ] });
}

// app/routes/notes.$noteId.tsx
var notes_noteId_exports = {};
__export(notes_noteId_exports, {
  ErrorBoundary: () => ErrorBoundary,
  action: () => action4,
  default: () => NoteDetailsPage,
  loader: () => loader7
});
var import_node8 = require("@remix-run/node"), import_react10 = require("@remix-run/react"), import_tiny_invariant2 = __toESM(require("tiny-invariant"));
var import_jsx_runtime7 = require("react/jsx-runtime");
async function loader7({ request, params }) {
  let userId = await requireUserId(request);
  (0, import_tiny_invariant2.default)(params.noteId, "noteId not found");
  let note = await getNote({ userId, id: params.noteId });
  if (!note)
    throw new Response("Not Found", { status: 404 });
  return (0, import_node8.json)({ note });
}
async function action4({ request, params }) {
  let userId = await requireUserId(request);
  return (0, import_tiny_invariant2.default)(params.noteId, "noteId not found"), await deleteNote({ userId, id: params.noteId }), (0, import_node8.redirect)("/notes");
}
function NoteDetailsPage() {
  let data = (0, import_react10.useLoaderData)();
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { className: "text-2xl font-bold", children: data.note.title }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "py-6", children: data.note.body }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("hr", { className: "my-4" }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(import_react10.Form, { method: "post", children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "button",
      {
        type: "submit",
        className: "rounded bg-blue-500  px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400",
        children: "Delete"
      }
    ) })
  ] });
}
function ErrorBoundary() {
  let error = (0, import_react10.useRouteError)();
  return error instanceof Error ? /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
    "An unexpected error occurred: ",
    error.message
  ] }) : (0, import_react10.isRouteErrorResponse)(error) ? error.status === 404 ? /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { children: "Note not found" }) : /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
    "An unexpected error occurred: ",
    error.statusText
  ] }) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h1", { children: "Unknown Error" });
}

// app/routes/notes._index.tsx
var notes_index_exports = {};
__export(notes_index_exports, {
  default: () => NoteIndexPage
});
var import_react11 = require("@remix-run/react"), import_jsx_runtime8 = require("react/jsx-runtime");
function NoteIndexPage() {
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)("p", { children: [
    "No note selected. Select a note on the left, or",
    " ",
    /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(import_react11.Link, { to: "new", className: "text-blue-500 underline", children: "create a new note." })
  ] });
}

// app/routes/notes.new.tsx
var notes_new_exports = {};
__export(notes_new_exports, {
  action: () => action5,
  default: () => NewNotePage
});
var import_node9 = require("@remix-run/node"), import_react12 = require("@remix-run/react"), React3 = __toESM(require("react"));
var import_jsx_runtime9 = require("react/jsx-runtime");
async function action5({ request }) {
  let userId = await requireUserId(request), formData = await request.formData(), title = formData.get("title"), body = formData.get("body");
  if (typeof title != "string" || title.length === 0)
    return (0, import_node9.json)(
      { errors: { title: "Title is required", body: null } },
      { status: 400 }
    );
  if (typeof body != "string" || body.length === 0)
    return (0, import_node9.json)(
      { errors: { title: null, body: "Body is required" } },
      { status: 400 }
    );
  let note = await createNote({ title, body, userId });
  return (0, import_node9.redirect)(`/notes/${note.id}`);
}
function NewNotePage() {
  var _a, _b, _c, _d, _e, _f;
  let actionData = (0, import_react12.useActionData)(), titleRef = React3.useRef(null), bodyRef = React3.useRef(null);
  return React3.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    (_a2 = actionData == null ? void 0 : actionData.errors) != null && _a2.title ? (_b2 = titleRef.current) == null || _b2.focus() : (_c2 = actionData == null ? void 0 : actionData.errors) != null && _c2.body && ((_d2 = bodyRef.current) == null || _d2.focus());
  }, [actionData]), /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
    import_react12.Form,
    {
      method: "post",
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: "flex w-full flex-col gap-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: "Title: " }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "input",
              {
                ref: titleRef,
                name: "title",
                className: "flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose",
                "aria-invalid": (_a = actionData == null ? void 0 : actionData.errors) != null && _a.title ? !0 : void 0,
                "aria-errormessage": (_b = actionData == null ? void 0 : actionData.errors) != null && _b.title ? "title-error" : void 0
              }
            )
          ] }),
          ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.title) && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "pt-1 text-red-700", id: "title-error", children: actionData.errors.title })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: "flex w-full flex-col gap-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { children: "Body: " }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "textarea",
              {
                ref: bodyRef,
                name: "body",
                rows: 8,
                className: "w-full flex-1 rounded-md border-2 border-blue-500 px-3 py-2 text-lg leading-6",
                "aria-invalid": (_d = actionData == null ? void 0 : actionData.errors) != null && _d.body ? !0 : void 0,
                "aria-errormessage": (_e = actionData == null ? void 0 : actionData.errors) != null && _e.body ? "body-error" : void 0
              }
            )
          ] }),
          ((_f = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _f.body) && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "pt-1 text-red-700", id: "body-error", children: actionData.errors.body })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "text-right", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "button",
          {
            type: "submit",
            className: "rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400",
            children: "Save"
          }
        ) })
      ]
    }
  );
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { version: "e429b466", entry: { module: "/build/entry.client-6CNAQZXI.js", imports: ["/build/_shared/chunk-ZIVUPZBS.js", "/build/_shared/chunk-BXQRMLZD.js", "/build/_shared/chunk-Q3IECNXJ.js"] }, routes: { root: { id: "root", parentId: void 0, path: "", index: void 0, caseSensitive: void 0, module: "/build/root-7FY32CXD.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/_index": { id: "routes/_index", parentId: "root", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/_index-VKALBC7E.js", imports: ["/build/_shared/chunk-C4XMAHCO.js"], hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/healthcheck": { id: "routes/healthcheck", parentId: "root", path: "healthcheck", index: void 0, caseSensitive: void 0, module: "/build/routes/healthcheck-BQ2SXEZN.js", imports: void 0, hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/join": { id: "routes/join", parentId: "root", path: "join", index: void 0, caseSensitive: void 0, module: "/build/routes/join-YV6Q3YOP.js", imports: ["/build/_shared/chunk-JA76ZJ7B.js", "/build/_shared/chunk-FPOB764B.js", "/build/_shared/chunk-C4XMAHCO.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/login": { id: "routes/login", parentId: "root", path: "login", index: void 0, caseSensitive: void 0, module: "/build/routes/login-MDROQ2T3.js", imports: ["/build/_shared/chunk-JA76ZJ7B.js", "/build/_shared/chunk-FPOB764B.js", "/build/_shared/chunk-C4XMAHCO.js"], hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/logout": { id: "routes/logout", parentId: "root", path: "logout", index: void 0, caseSensitive: void 0, module: "/build/routes/logout-GPTXG6BX.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/notes": { id: "routes/notes", parentId: "root", path: "notes", index: void 0, caseSensitive: void 0, module: "/build/routes/notes-GY65ZNEJ.js", imports: ["/build/_shared/chunk-EXA2H3AC.js", "/build/_shared/chunk-FPOB764B.js", "/build/_shared/chunk-C4XMAHCO.js"], hasAction: !1, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/notes.$noteId": { id: "routes/notes.$noteId", parentId: "routes/notes", path: ":noteId", index: void 0, caseSensitive: void 0, module: "/build/routes/notes.$noteId-JNHMC3EW.js", imports: void 0, hasAction: !0, hasLoader: !0, hasCatchBoundary: !1, hasErrorBoundary: !0 }, "routes/notes._index": { id: "routes/notes._index", parentId: "routes/notes", path: void 0, index: !0, caseSensitive: void 0, module: "/build/routes/notes._index-2JPSR6HI.js", imports: void 0, hasAction: !1, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 }, "routes/notes.new": { id: "routes/notes.new", parentId: "routes/notes", path: "new", index: void 0, caseSensitive: void 0, module: "/build/routes/notes.new-63ZJPGHR.js", imports: void 0, hasAction: !0, hasLoader: !1, hasCatchBoundary: !1, hasErrorBoundary: !1 } }, cssBundleHref: void 0, hmr: void 0, url: "/build/manifest-E429B466.js" };

// server-entry-module:@remix-run/dev/server-build
var assetsBuildDirectory = "public/build", future = { unstable_cssModules: !1, unstable_cssSideEffectImports: !1, unstable_dev: !1, unstable_postcss: !1, unstable_tailwind: !1, unstable_vanillaExtract: !1, v2_errorBoundary: !0, v2_meta: !0, v2_routeConvention: !0 }, publicPath = "/build/", entry = { module: entry_server_exports }, routes = {
  root: {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: index_exports
  },
  "routes/healthcheck": {
    id: "routes/healthcheck",
    parentId: "root",
    path: "healthcheck",
    index: void 0,
    caseSensitive: void 0,
    module: healthcheck_exports
  },
  "routes/join": {
    id: "routes/join",
    parentId: "root",
    path: "join",
    index: void 0,
    caseSensitive: void 0,
    module: join_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/notes": {
    id: "routes/notes",
    parentId: "root",
    path: "notes",
    index: void 0,
    caseSensitive: void 0,
    module: notes_exports
  },
  "routes/notes.$noteId": {
    id: "routes/notes.$noteId",
    parentId: "routes/notes",
    path: ":noteId",
    index: void 0,
    caseSensitive: void 0,
    module: notes_noteId_exports
  },
  "routes/notes._index": {
    id: "routes/notes._index",
    parentId: "routes/notes",
    path: void 0,
    index: !0,
    caseSensitive: void 0,
    module: notes_index_exports
  },
  "routes/notes.new": {
    id: "routes/notes.new",
    parentId: "routes/notes",
    path: "new",
    index: void 0,
    caseSensitive: void 0,
    module: notes_new_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  assetsBuildDirectory,
  entry,
  future,
  publicPath,
  routes
});
