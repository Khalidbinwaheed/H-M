import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { LiveDataProvider } from "@/components/providers/LiveDataProvider";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "H&M Trads Admin Dashboard" },
      { name: "description", content: "Enterprise admin console for H&M Trads laptop and accessories inventory, sales and customers." },
      { name: "author", content: "H&M Trads" },
      { property: "og:title", content: "H&M Trads Admin Dashboard" },
      { property: "og:description", content: "Enterprise admin console for H&M Trads laptop and accessories inventory, sales and customers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "H&M Trads Admin Dashboard" },
      { name: "twitter:description", content: "Enterprise admin console for H&M Trads laptop and accessories inventory, sales and customers." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fca94d5e-9088-4141-934e-78a05fa7a464/id-preview-933cbae8--b4822cf5-9fda-4def-b187-d5ecd722d230.lovable.app-1778604670063.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/fca94d5e-9088-4141-934e-78a05fa7a464/id-preview-933cbae8--b4822cf5-9fda-4def-b187-d5ecd722d230.lovable.app-1778604670063.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const path = router.state.location.pathname;
    const isAuthRoute = path === "/login" || path === "/signup";
    
    if (!isAuthenticated && !isAuthRoute) {
      router.navigate({ to: "/login" });
    } else if (isAuthenticated && isAuthRoute) {
      router.navigate({ to: "/" });
    }
  }, [isAuthenticated, router.state.location.pathname, router]);

  // Don't render the app shell providers if not authenticated and not on login page
  // This prevents LiveDataProvider from fetching data without a token
  if (!isAuthenticated && router.state.location.pathname !== "/login" && router.state.location.pathname !== "/signup") {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      {isAuthenticated ? (
        <LiveDataProvider>
          <div className="dark">
            <Outlet />
            <Toaster />
          </div>
        </LiveDataProvider>
      ) : (
        <div className="dark">
          <Outlet />
          <Toaster />
        </div>
      )}
    </QueryClientProvider>
  );
}
