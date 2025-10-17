'use strict';

const build = require('@microsoft/sp-build-web');

<<<<<<< HEAD
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));
=======
// Ignora aviso de estilo
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Corrige o mapeamento do "serve"
const originalGetTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  const result = originalGetTasks.call(build.rig);

  if (result.has('serve-deprecated')) {
    result.set('serve', result.get('serve-deprecated'));
  }
>>>>>>> ed49af9442b53acecaf6b7a0f33b49d4177ff268

  return result;
};

<<<<<<< HEAD
=======
// Inicializa o sistema de build do SPFx
>>>>>>> ed49af9442b53acecaf6b7a0f33b49d4177ff268
build.initialize(require('gulp'));
