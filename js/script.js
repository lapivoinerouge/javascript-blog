{
  'use strict';

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorsListLink: Handlebars.compile(document.querySelector('#template-authors-list-link').innerHTML)
  }

  const opts = {
    articleSelector: '.post',
    titleSelector: '.post-title',
    titleListSelector: '.titles',
    articleTagsSelector: '.post-tags .list',
    articleAuthorSelector: '.post-author',
    tagsListSelector: '.tags.list',
    cloudClassCount: 5,
    cloudClassPrefix: 'tag-size-',
    authorsListSelector: '.authors.list'
  };

  const titleClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;
    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll(opts.titleListSelector + ' a.active');
    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');
    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const linkUrl = clickedElement.getAttribute('href');

    /* find the correct article using the selector (value of 'href' attribute) */
    const activeArticle = document.querySelector(linkUrl);

    /* add class 'active' to the correct article */
    activeArticle.classList.add('active');
  };

  const generateTitleLinks = function(customSelector = '') {
    const titleList = document.querySelector(opts.titleListSelector);
    titleList.innerHTML = '';

    const articleList = document.querySelectorAll(opts.articleSelector + customSelector);
    for (let article of articleList) {
      const title = article.querySelector(opts.titleSelector).innerHTML;
      const articleId = article.getAttribute('id');
      // const linkHTML = '<li><a href="#' + articleId + '"><span>' + title + '</span></a></li>';
      const linkHTMLData = {id: articleId, title: title};
      const linkHTML = templates.articleLink(linkHTMLData);

      titleList.insertAdjacentHTML('beforeend', linkHTML);

      const links = document.querySelectorAll(opts.titleListSelector + ' a');

      for (let link of links) {
        link.addEventListener('click', titleClickHandler);
      }
    }
  };

  generateTitleLinks();

  const calculateTagsParams = function(tags) {

    const params = {
      min: 999999,
      max: 0
    };

    for (let tag in tags) {
      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.min);
    }

    return params;
  };

  const calculateTagClass = function(count, params) {
    return opts.cloudClassPrefix + Math.floor( ( (count - params.min) / (params.max - params.min) ) * (opts.cloudClassCount - 1) + 1 );
  };

  const generateTags = function() {
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};

    /* find all articles */
    const articles = document.querySelectorAll('article');

    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const tagWrapper = article.querySelector(opts.articleTagsSelector);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      /* split tags into array */
      const tags = article.getAttribute('data-tags').split(' ');
      /* START LOOP: for each tag */
      for (let tag of tags) {
        /* generate HTML of the link */
        // const tagHtml = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        const linkHTMLData = {id: 'tag-' + tag, tag: tag};
        const tagHtml = templates.tagLink(linkHTMLData);

        /* add generated code to html variable */
        html += tagHtml;

        /* [NEW] check if this link is NOT already in allTags */
        if (!allTags[tag]) {
          /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagWrapper.innerHTML = html;
      /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(opts.tagsListSelector);

    const tagsParams = calculateTagsParams(allTags);

    /* [NEW] create variable for all links HTML code */
    const allTagsData = {tags: []};

    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags) {
      /* [NEW] generate code of a link and add it to allTagsHTML */
      // const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '</a></li> ';
      // allTagsHTML += tagLinkHTML;
      allTagsData.tags.push({
        id: 'tag-' + tag,
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
      /* [NEW] END LOOP: for each tag in allTags: */
    }

    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  };

  generateTags();

  const tagClickHandler = function(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {
      /* remove class active */
      activeTagLink.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let tagLink of tagLinks) {
      /* add class active */
      tagLink.classList.add('active');
    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const addClickListenersToTags = function() {
    /* find all links to tags */
    var tagLinks = document.querySelectorAll('a[href^="#tag-"]');

    /* START LOOP: for each link */
    for (let tagLink of tagLinks) {
      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
    }
  };

  addClickListenersToTags();

  const generateAuthors = function() {
    /* [NEW] create a new variable allTags with an empty object */
    let authors = {};
    /* find all articles */
    const articles = document.querySelectorAll('article');

    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find authors wrapper */
      const authorWrapper = article.querySelector(opts.articleAuthorSelector);
      /* get author from data-author attribute */
      const author = article.getAttribute('data-author');
      const authorId = 'author-' + author.toLowerCase().replace(' ', '-');
      /* create link for author */
      // const authorHtml = '<a href="#author-' + author.toLowerCase().replace(' ', '-') + '">' + author + '</a>';
      const linkHTMLData = {id: authorId, author: author};
      const authorHtml = templates.authorLink(linkHTMLData);

      /* add author link to wrapper */
      authorWrapper.innerHTML = authorHtml;

      if (!authors[author]) {
        authors[author] = 1;
      } else {
        authors[author]++;
      }
    }

    const authorsList = document.querySelector(opts.authorsListSelector);
    // let authorsHTML = '';
    const allAuthorsData = {authors: []};

    for(let author in authors) {
      allAuthorsData.authors.push({
        id: 'author-' + author.toLowerCase().replace(' ', '-'),
        author: author,
        count: authors[author],
      });
      // const authorHTML = '<li><a href="#tag-' + author + '">' + author + '(' + authors[author] + ')</a></li> ';
      // authorsHTML += authorHTML;
    }
    authorsList.innerHTML = templates.authorsListLink(allAuthorsData);
  };

  generateAuthors();

  const authorClickHandler = function(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const author = clickedElement.innerHTML;
    /* find all tag links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
    /* START LOOP: for each active tag link */
    for (let activeAuthorLink of activeAuthorLinks) {
      /* remove class active */
      activeAuthorLink.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let authorLink of authorLinks) {
      /* add class active */
      authorLink.classList.add('active');
    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  };

  const addClickListenersToAuthors = function() {
    /* find all links to authors */
    var authorLinks = document.querySelectorAll('a[href^="#author-"]');
    console.log(authorLinks);

    /* START LOOP: for each link */
    for (let authorLink of authorLinks) {
      /* add tagClickHandler as event listener for that link */
      authorLink.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
    }
  };

  addClickListenersToAuthors();
}
