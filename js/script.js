{
  'use strict';

  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list';

  const titleClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;
    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll(optTitleListSelector + ' a.active');
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
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';

    const articleList = document.querySelectorAll(optArticleSelector + customSelector);
    for (let article of articleList) {
      const title = article.querySelector(optTitleSelector).innerHTML;
      const articleId = article.getAttribute('id');
      const linkHTML = '<li><a href="#' + articleId + '"><span>' + title + '</span></a></li>';
      titleList.insertAdjacentHTML('beforeend', linkHTML);

      const links = document.querySelectorAll(optTitleListSelector + ' a');

      for (let link of links) {
        link.addEventListener('click', titleClickHandler);
      }
    }
  };

  generateTitleLinks();

  const generateTags = function() {
    /* find all articles */
    const articles = document.querySelectorAll('article');

    /* START LOOP: for every article: */
    for (let article of articles) {
      /* find tags wrapper */
      const tagWrapper = article.querySelector(optArticleTagsSelector);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      /* split tags into array */
      const tags = article.getAttribute('data-tags').split(' ');
      /* START LOOP: for each tag */
      for (let tag of tags) {
        /* generate HTML of the link */
        const tagHtml = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
        /* add generated code to html variable */
        html += tagHtml;
      /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagWrapper.innerHTML = html;
      /* END LOOP: for every article: */
    }
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
    var tagLinks = document.querySelectorAll(optArticleTagsSelector + ' a');

    /* START LOOP: for each link */
    for (let tagLink of tagLinks) {
      /* add tagClickHandler as event listener for that link */
      tagLink.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
    }
  };

  addClickListenersToTags();
}
