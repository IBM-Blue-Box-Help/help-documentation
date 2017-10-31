![header](/readme-img/bluebox-help.png)

## Running Locally
1. Clone the repo 
2. Check whether you have Ruby 2.0.0 or higher installed `ruby --version`
3. Install Bundler:
```BASH
gem install bundler
```
4. Check whether you have Node v6.9 or installed `node -v`
5. Install Node and NPM (if necessary):
```BASH 
brew install nvm
nvm install node --reinstall-packages-from=node
npm install
```
6. Build and Run locally with:
```
bundle exec jekyll serve
```  
7. Visit your static web site in a web browser:  
  http://localhost:4444/help-documentation/

## Deployment
1. Build your static web site with jekyll
```BASH
# the 'build' command is more concise, but 'serve' would also work
bundle exec jekyll build
```
2. Release you the static website to the 'gh-pages' branch of your origin repo
```BASH
# the './dist' directory must contain the static website
node deploy.js
```
3. Visit your production website to verify the changes. Note: The changes may take several minutes after the deploy script exits to reach your production Github environment.

## Troubleshooting

You may need to modify some local pieces of configuration in the `./_config.yml` in order for your css, javascript, and other assets build their links correctly for your specific deployment path:

For example, the following line in `_config.yml`:
```YML
baseurl: "/help-documentation" # the subpath of your site, e.g. /blog
```

Could have to be changed to:
```YML
baseurl: "/wsulzer/help-documentation-staging-area/" # the subpath of your site, e.g. /blog
```

You would then need to rebuild and redeploy the web site as described above.

## Github Organization
1. [Basic Github folder Organization](#basic-github-folder-organization)
2. [Folders for Content](#folders-for-content)
3. [Folders for site structure, page layout and global styling](#folders-for-site-structure)


## Article Post
1. [Setting up an article](#setting-up-an-article)
2. [Code highlighting](#code-highlighting)
3. [Tag best practices](#tag-best-practices)


#### <a name="basic-github-folder-organization"></a>![github](/readme-img/github-org.png)

Most of the folders with underscores before the name (e.g. `_gettingstarted`) will appear at the top of the list of folders. These folders will contain the content that will appear on the site.

The folders without underscores (e.g. `css`) will contain code for the layout and style of the site.

#### <a name="folders-for-content"></a>Folders for Content

With the exception of `_sass`, `_layouts`, and `_includes`, all of the folders at the top of the list named `_categoryName` contain articles organized under these specific groupings. The content of these files can be edited. The changes will only affect the article associated with that file.  

![docs](/readme-img/github-org-underscore.png)

#### <a name="folders-for-site-structure"></a>Folders for site structure, page layout and global styling

With the exception of `_sass`, `_layouts`, and `_includes`, all of the folders with the naming convention `folderName` contain markup that affect the layout and styling either at a global level or article level. Approach adding or editing to the content of this folder with caution

![structure](/readme-img/github-org-structure.png)

#### <a name="setting-up-an-article"></a> ![article](/readme-img/article.png)

Articles require the follow content areas filled to maintain a consistent layout:  Layout, Title, Featured, Weight, Tags, DateAdded, Author, and Content.

##### Layout

This will always be set to page. This tells Jekyll how to render the documentation HTML.

##### Title

This will set the header for the documentation page being written. This will also be the title displayed in all nav bars, searches, etc..

##### Featured

If this is set to true, the document will be visible in the nav bar by default. If this is set to false, it will be hidden but can be navigated to by clicking ‘view more’ in the nav.

##### Weight

This determines the order of items displayed in the nav. 1 will be given highest priority, 2 second, and so on. Not required, but allows you to order the nav in a specific way. For instance, the most trafficked page on your site could be given a weight of 1 so that it appears first on the nav list.

##### Tags

These are displayed on both the documentation page as well as the search page. The tags must be enclosed in brackets [ ], and are comma delimited.

##### DateAdded

This data attribute is added to the header-data next to the page author. There is no specific format, as it will just take whatever you type here and add it to the post.

##### Author

This data attribute is also added to the header-data and, like the date, does not have any specific format.

#### <a name="code-highlighting"></a>![highlighting](/readme-img/highlighting.png)

Code Highlighting ( ``` ) via markdown is not rendering line breaks properly. To fix this, Jekyll has a built in code highlighter that wraps the code properly. To use this, encapsulate code snippets in the following format (specifying the language highlighting to use):

```
{% highlight bash %}
YOUR CODE HERE
{% endhighlight %}
```

#### <a name="tag-best-practices"></a>![tags](/readme-img/tags.png)

Tags are a core component of the search and browsing experience. It helps the search tool find articles as they are organized according to categories. It also is beneficial with helping the user understand the context how the articles are organized.

When creating a new article, include tags in this order [ category, subject, subject]. For example, if an article is to be organized under ‘Getting Started,’ then the order will be [ getting started, subject name, subject name ].

**NOTE:** If you'd like to submit a PR but do not want it to be merged right away, for instance if you are waiting for technical review from your colleagues, please include WIP in the PR title. When you are ready for merge, please remove WIP, and if convenient, add a comment requesting the merge. Thanks!
