import { asPluginPage, type PluginRouteTable } from "@venore/plugin-sdk";
import AdminPage from "./admin/page";
import PublicPage from "./public/page";
import PublicJobPage from "./public/job/page";

export const vagasRouteTable: PluginRouteTable = {
  admin: [{ pattern: "", Component: asPluginPage(AdminPage) }],
  public: [
    { pattern: "vagas", Component: asPluginPage(PublicPage) },
    { pattern: "vagas/:slug", Component: asPluginPage(PublicJobPage) },
  ],
};
