import { asPluginPage, type PluginRouteTable } from "@venore/plugin-sdk";
import AdminPage from "./admin/page";
import AdminCategoriesPage from "./admin-categories/page";
import AdminTagsPage from "./admin-tags/page";
import AdminFormTemplatesPage from "./admin-form-templates/page";
import AdminApplicationsPage from "./admin-applications/page";
import AdminApplicationDiscReportPage from "./admin-applications/disc-report-page";
import PublicPage from "./public/page";
import PublicJobPage from "./public/job/page";
import PublicJobApplicationConfirmationPage from "./public/job-application-confirmation/page";

export const vagasRouteTable: PluginRouteTable = {
  admin: [
    { pattern: "", Component: asPluginPage(AdminPage) },
    { pattern: "categorias", Component: asPluginPage(AdminCategoriesPage) },
    { pattern: "listas", Component: asPluginPage(AdminTagsPage) },
    { pattern: "formularios", Component: asPluginPage(AdminFormTemplatesPage) },
    { pattern: ":jobId/candidaturas", Component: asPluginPage(AdminApplicationsPage) },
    {
      pattern: ":jobId/candidaturas/:applicationId/relatorio-disc",
      Component: asPluginPage(AdminApplicationDiscReportPage),
    },
  ],
  public: [
    { pattern: "vagas", Component: asPluginPage(PublicPage) },
    { pattern: "vagas/:slug", Component: asPluginPage(PublicJobPage) },
    {
      pattern: "vagas/:slug/candidatura/:applicationId/concluido",
      Component: asPluginPage(PublicJobApplicationConfirmationPage),
    },
  ],
};
