// module.exports = function (plop) {
//   plop.setGenerator("component", {
//     description: "Create a React component + Storybook story",
//     prompts: [
//       {
//         type: "input",
//         name: "path",
//         message: "Component path relative to renderer/, e.g. auth/auth or PageTes:",
//         validate: (value) => {
//           if (!value) return "Path is required";
//           if (value.endsWith(".tsx"))
//             return "Do not include .tsx extension in path";
//           return true;
//         },
//       },
//     ],
//     actions: function (data) {
//       const segments = data.path.split(/[\/\\]/);
//       const componentName = segments[segments.length - 1]; // 마지막 segment가 파일 이름
//       const componentDir =
//         segments.length === 1 ? segments[0] : segments.slice(0, -1).join("/"); // 나머지 segment가 폴더
//       console.log(componentDir)
//       return [
//         {
//           type: "add",
//           path: `src/renderer/components/${componentDir}/${componentName}.tsx`,
//           templateFile: "plop-templates/component.tsx.hbs",
//         },
//         {
//           type: "add",
//           path: `src/renderer/components/${componentDir}/${componentName}.stories.tsx`,
//           templateFile: "plop-templates/component.stories.tsx.hbs",
//         },
//         {
//           type: "add",
//           path: `src/renderer/components/${componentDir}/index.ts`,
//           template: `export * from "./${componentName}";`,
//           skipIfExists: true,
//         },
//       ];
//     },
//   });
// };

module.exports = function (plop) {
  // controller generator
  const toPascal = (str) =>
    str
      .replace(/[-_]/g, " ")                 // snake-case, kebab-case → 공백
      .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
      .replace(/^(.)/, (_, c) => c.toUpperCase());

  plop.setHelper("GetFileName", function (text) {
    const segments = text.split(/[\/\\]/); 
    console.log(segments) 
    return toPascal(segments[segments.length - 1]);
  });
  plop.setHelper("GetPath", function (text) {
    const segments = text.split(/[\/\\]/); 
    if (segments.length === 1) 
      return ''; // 

    if(segments.length > 1){
      return segments.slice(0, -1).join("/")
    }

    return ''
  });
  plop.setGenerator("component", {
    description: "application controller logic",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "component name please",
      },
    ],
    actions: [
       {
          type: "add",
          path: `src/renderer/components/{{GetPath name}}/{{GetFileName name}}.tsx`,
          templateFile: "plop-templates/component.tsx.hbs",
        },
        {
          type: "add",
          path: `src/renderer/components/{{GetPath name}}/{{GetFileName name}}.stories.tsx`,
          templateFile: "plop-templates/component.stories.tsx.hbs",
        },
    ],
  });
}