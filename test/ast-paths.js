var path = require('path');
var assert = require('assert');
var AST = require('../lib/ast');

describe('@import paths', function() {
  var resultSync, resultAsync;
  var sync, async;

  before(function(done) {
    var opts = {
      file: './style/paths/index.scss',
      includePaths: ['./stylelib/'],
      cwd: __dirname
    };

    AST.parse(opts, function(err, result) {
      resultAsync = result;
      resultSync = AST.parseSync(opts);
      sync = resultSync.ast.toString();
      async = resultAsync.ast.toString();
      done();
    });
  })

  it ('includes locally-pathed file dependencies.', function() {
    // from index.scss => path/a
    assert.contain(sync, '.index');
    assert.contain(sync, '.path_a');
    assert.contain(async, '.index');
    assert.contain(async, '.path_a');
  })

  it ('resolves deeply-nested relative file dependencies.', function() {
    // from index.scss => path/a => path/b
    assert.contain(sync, '.path_path_b');
    assert.contain(async, '.path_path_b');
  })

  it ('resolves deep file dependencies with path backtraces.', function() {
    // from index.scss => path/a => path/b => ../../c
    assert.contain(sync, '.c');
    assert.contain(async, '.c');
  })

  it ('resolves files available via includePaths.', function() {
    // from index.scss => stylelib/base/main
    assert.contain(sync, '.base_main');
    assert.contain(async, '.base_main');
  })

  it ('resolves relative import references into absolute file paths.', function() {
    assert.equal(resultSync.file, path.join(__dirname, 'style/paths/index.scss'));
    assert.equal(resultAsync.file, path.join(__dirname, 'style/paths/index.scss'));
  })
})