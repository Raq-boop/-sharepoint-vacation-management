'use strict';

const build = require('@microsoft/sp-build-web');

// Ignora aviso de estilo
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Corrige o mapeamento do "serve"
const originalGetTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  const result = originalGetTasks.call(build.rig);

  if (result.has('serve-deprecated')) {
    result.set('serve', result.get('serve-deprecated'));
  }

  return result;
};

// Inicializa o sistema de build do SPFx
build.initialize(require('gulp'));
