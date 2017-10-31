var ghpages = require('gh-pages');
var path = require('path');

var env = process.argv[2] || "staging"

var repo;
switch(env.toUpperCase()) {
  case "PRODUCTION":
    repo = "git@github.com:IBM-Blue-Box-Help/help-documentation.git";
    break;
  case "STAGING":
    repo = "git@github.ibm.com:bluebox/help-documentation-staging-area.git";
    break;
  default:
    console.log("The specified environment '" + env + "' is not supported");
    process.exit(1);
}

ghpages.publish('dist', {repo: repo}, function(err) {
  if (err !== undefined) {
    console.error(err);
    process.exit(1);
  } else {
    console.log("Successfully pushed to 'gh-pages' branch.")
  }
});
