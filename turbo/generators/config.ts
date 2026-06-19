import { PlopTypes } from "@turbo/gen";
import * as fs from "node:fs";
import * as path from "node:path";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  const appsDir = path.join(process.cwd(), "apps");

  const appChoices: string[] = fs.existsSync(appsDir)
    ? fs
      .readdirSync(appsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort()
    : [];

  plop.setGenerator("package", {
    description: "Create a new workspace package",

    prompts: [
      {
        type: "input",
        name: "name",
        message: "Package name",
        validate: (input: string) => {
          if (!input) return "Package name is required";
          return true;
        },
      },
    ],

    actions: [
      {
        type: "addMany",
        destination: "{{ turbo.paths.root }}/packages/{{dashCase name}}",
        base: "templates/base-package",
        templateFiles: "templates/base-package/**/*",
      },
    ],
  });

  plop.setGenerator("feature", {
    description: "Create a feature inside an app",

    prompts: [
      {
        type: "list",
        name: "app",
        message: "Select target app",
        choices: appChoices,
      },
      {
        type: "input",
        name: "name",
        message: "Feature name",
        validate: (input: string) => {
          if (!input) return "Feature name is required";
          return true;
        },
      },
    ],

    actions: [
      {
        type: "addMany",
        destination:
          "{{ turbo.paths.root }}/apps/{{app}}/src/features/{{dashCase name}}",
        base: "templates/feature",
        templateFiles: "templates/feature/**/*",
      },
    ],
  });
}