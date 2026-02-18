(function () {
  var activeTab = 'sublime';
  var navItems = document.querySelectorAll('.nav-e3-item[data-tab], .nav-e3-profile-wrap[data-tab]');
  var addBtn = document.querySelector('.nav-add-e2');
  var addWrap = document.querySelector('.nav-add-e2-wrap');
  var addMenu = document.getElementById('add-menu');
  var libraryView = document.getElementById('library-view');
  var sublimeView = document.getElementById('sublime-view');
  var inboxView = document.getElementById('inbox-view');
  var profileView = document.getElementById('profile-view');
  var collectionView = document.getElementById('collection-view');

  // --- Staff picks feed only. Following shows empty feed. ---
  var activeSublimeCategory = 'staff-picks';

  var staffPicksFeedCards = [
    { type: 'highlight', body: 'Students come to my office with problems I can\'t begin to unpack. No, I can\'t tell you why you have dreams about murdering people. No, I can\'t explain why your dad told you it\'s your mom\'s fault you slice your arms up like deli meat. No, I don\'t know why the doctor screwed up your prescription and you are out of your meds or why your sister won\'t drive to Boston to get you more.\n\nWhat they need is years of therapy and mental health care that their insurance will never cover. They need stable housing, better health care, braces, and acne medication.\n\nWhat they have is me.\n\nWhat I have is and.\n\nSo that\'s what I tell them.\n\nYou can feel sad and you can do five math problems.\n\nYou can be nervous and write the last paragraph of your essay.\n\nYou can be anxious and pick up trash in the hallway.\n\nYou can feel mad and eat a piece of fruit.\n\nAnd nothing will really be fixed, but then, it wasn\'t really going to get fixed anyway. But maybe they\'ll be a little bit better at algebra or feel a little bit healthier.\n\nIt\'s not magic advice, but sometimes the nudge is enough to put things in motion again.', author: 'Emily Kingsley', sourceTitle: 'You Are Not Okay and Tomorrow Will Come' },
    { type: 'highlight', body: 'A sailboat always moves forward.\n\nThis remarkable fact is due to its asymmetrical shape: it is pointy at the front and flat in the back. This creates resistance to moving backwards, but a natural ease in moving forward. Even when the water is randomly undulating, "backward" forces are muted, while "forward" forces are allowed, so the boat glides forward. Asymmetries can amplify positive effects while muting negative ones, resulting in a net-positive force even under conditions of random inputs.', author: 'Jason Cohen', sourceTitle: 'A Smart Bear » What makes a strategy great' },
    { type: 'highlight', body: 'The status signal is circular: you can afford to be selectively online because you have capital, and being selectively online signals you have capital. The rest of us are still grinding for algorithmic visibility because we don\'t have another choice.', author: 'Eugene Healey', sourceTitle: 'Post-Luxury Status Symbol #1: Connected Privacy' },
    { type: 'highlight', body: 'I have a theory about nostalgia : It happens because the best survival strategy in an uncertain world is to overworry. When you look back, you forget about all the things you worried about that never came true. So life appears better in the past because in hindsight there wasn\'t as much to worry about as you were actually worrying about at the time.', author: 'Morgan Housel', sourceTitle: 'A Few Things I\'m Pretty Sure About' },
    { type: 'text', body: 'Last night I sat down to write and something strange happened. Instead of facing a blank page, I faced myself. Every article that ever moved me. Every image that ever stopped time. Every quote that ever felt like a key unlocking a door I didn\'t know was there.' },
    { type: 'text', body: 'Only silence enables us to say something unheard of. The compulsion of communication, by contrast, leads to the reproduction of the same, to conformism: So it\'s not a problem of getting people to express themselves but of providing little gaps of solitude and silence in which they might eventually find something to say.' },
    { type: 'text', body: 'it is an emergency\nthe apocalypse has already happened\n\nand how we will act now is essential\n\nafter the mass extinction\nwe will start anew\nour old comfort is gone\nwe will parade with mutated crickets in glowing radio-active harvests\n\nmigrate with wildebeests\namongst endangered orangutans\n\na new world\nwith an emergence of assembla' },
    { type: 'text', body: '"We live in a world shaped by stories. Stories are the threads of our lives and the fabric of human cultures. A story can unite or divide people(s), obscure issues, or spotlight new perspectives. A story can inform or deceive, enlighten or entertain, or even do all of the above. Those who do not have power over the story that dominates their lives, the power to retell it, rethink it, deconstruct it, joke about it, and change it as times change, truly are powerless, because they cannot think new thoughts."' },
    { type: 'text', body: 'We think we tell stories, but stories often tell us, tell us to love or to hate, to see or be blind. Often, too often, stories saddle us, ride us, whip us onward, tell us what to do, and we do it without questioning. The task of learning to be free requires learning to hear them, to question them, to pause and to hear silence, to name them, and then to become the storyteller.' },
    { type: 'text', body: 'The fact the catchphrase is\n"tax the rich" and not "help the poor" is telling.\n\nAntonio Garcia Martinez' },
    { type: 'text', body: 'A reader\'s favorite subject is the reader.\nDerek Thompson' },
    { type: 'text', body: 'core question:\n\n\nAre there invisible patterns that underlie all great stories?' },
    /* Image cards from feed images folder (Staff picks only) */
    { type: 'image', src: '../feed images/0f0a15ef-2186-492b-8138-f66a5df26ec0.png' },
    { type: 'image', src: '../feed images/1050.jpg' },
    { type: 'image', src: '../feed images/2.png' },
    { type: 'image', src: '../feed images/39e7ec24-758c-41a8-9703-20d066c0a515_1290x1340.webp' },
    { type: 'image', src: '../feed images/84b22282-bec5-4f5d-809d-c4379ac1a0b7_1241x1569.webp' },
    { type: 'image', src: '../feed images/a0a228d5-2e6a-48da-bb87-f28a758fb7c8_804x676.webp' },
    { type: 'image', src: '../feed images/f5df9621-6045-4d65-91ec-4f26654384d0_900x898.webp' },
    { type: 'image', src: '../feed images/find-image-DZwjf2Y6.avif' },
    { type: 'image', src: '../feed images/inspiration-image-DJx0yAgh.avif' },
    { type: 'image', src: '../feed images/original_4001f28844aae62b90d4114fafdf25b3 1.png' },
    { type: 'image', src: '../feed images/ooo.png' },
    { type: 'image', src: '../feed images/spoon-fork.png' },
    { type: 'image', src: '../feed images/spiral-field.png' },
    { type: 'image', src: '../feed images/Screenshot 2026-02-05 at 2.07.08 PM.png' },
    { type: 'image', src: '../feed images/Screenshot 2026-02-05 at 2.07.48 PM.png' },
    { type: 'image', src: '../feed images/thumbnail 2.48.34 PM.png' },
    { type: 'image', src: '../feed images/thumbnail-1.png' },
    /* Image card with caption + source (like text highlights) */
    { type: 'image', src: '../feed images/self-checkout.png', caption: '\'Self Checkout\': The social game you\'re already playing\n\nPresented at Art Basel Miami, @jckbtchr\'s \'Self Checkout\' wasn\'t designed to sentimentalize \'value\', it was created to expose the hidden economics of art fairs and put power back in the hands of the audience.\n\nToday, we would like to take a deep-dive into this artwork.\n\nIf you\'ve ever spoken to an art dealer during a fair, you might have glimpsed the fatigue beneath the glamour as they mentally tally the true cost of being there.\n\nButcher made that cost literal: -$74,211, the all-in expense of participating. He then invited visitors to pay whatever they wished for their own \'receipt\' artwork. The more you pay, the longer your receipt.\n\nThe overall outcome? An artist who isn\'t naïve about money or value, he simply refuses to let either hide behind pretense.', sourceTitle: 'instagram.com' },
    /* Image card: no caption, source only */
    { type: 'image', src: '../feed images/anemone-aquarium.png', sourceTitle: 'aquariumbcn.com' },
    { type: 'image', src: '../feed images/poolsuite-card.png', sourceTitle: 'Poolsuite™' },
    /* File/PDF cards: first-page preview + optional title, caption, author, source */
    { type: 'file', previewSrc: '../feed images/frequency-oem-vadik.png', title: 'Frequency Product Expoloration - OEM + Vadik', sourceTitle: 'oem.care' },
    { type: 'file', previewSrc: '../feed images/cult-brand-behavior-alex-tran.png', title: 'Cult Brand Behavior: Creative Rules for Culture Hacking', sourceTitle: 'mcusercontent.com' },
    { type: 'file', previewSrc: '../feed images/worlds-hardest-problems.png', title: "World's Hardest Problems", sourceTitle: 'docs.google.com' },
    { type: 'file', previewSrc: '../feed images/social-signals-2025-v5.png', title: 'social signals 2025_v5', sourceTitle: 'docs.google.com' },
    /* Video cards: native MP4 (loop preview) or YouTube embed; play icon bottom-left */
    { type: 'video', videoSrc: '../feed videos/sky.mp4' }
  ];

  var TEXT_TRUNCATE_LENGTH = 500;
  var IMAGE_CAPTION_TRUNCATE_LENGTH = 111;

  function buildTextCard(item) {
    var fullBody = item.body || '';
    var isLong = fullBody.length > TEXT_TRUNCATE_LENGTH;
    var card = document.createElement('div');
    card.className = 'sublime-feed__card sublime-card sublime-card--text';
    card.setAttribute('role', 'article');
    card.setAttribute('data-body-length', String(fullBody.length));
    if (isLong) card._fullBody = fullBody;
    var bodyWrap = document.createElement('div');
    bodyWrap.className = 'sublime-card__body-wrap';
    var bodyEl = document.createElement('div');
    bodyEl.className = 'sublime-card__body';
    bodyEl.textContent = isLong ? fullBody.substring(0, TEXT_TRUNCATE_LENGTH) : fullBody;
    var fadeEl = document.createElement('div');
    fadeEl.className = 'sublime-card__fade';
    fadeEl.setAttribute('aria-hidden', 'true');
    bodyWrap.appendChild(bodyEl);
    bodyWrap.appendChild(fadeEl);
    if (isLong) {
      var expandHit = document.createElement('div');
      expandHit.className = 'sublime-card__expand-hit';
      expandHit.setAttribute('aria-label', 'Expand text');
      expandHit.setAttribute('data-expand-for', 'body');
      bodyWrap.appendChild(expandHit);
      var expandWrap = document.createElement('div');
      expandWrap.className = 'sublime-card__expand-wrap';
      var lessBtn = document.createElement('button');
      lessBtn.type = 'button';
      lessBtn.className = 'sublime-card__less-btn';
      lessBtn.textContent = 'less';
      lessBtn.setAttribute('aria-label', 'Collapse text');
      lessBtn.setAttribute('data-collapse-for', 'body');
      lessBtn.style.display = 'none';
      expandWrap.appendChild(lessBtn);
      bodyWrap.appendChild(expandWrap);
    }
    card.appendChild(bodyWrap);
    return card;
  }

  function hideExpandIfNotTruncated(card) {
    var fade = card && card.querySelector('.sublime-card__fade');
    if (!fade) return;
    var len = parseInt(card.getAttribute('data-body-length'), 10);
    if (isNaN(len) || len <= TEXT_TRUNCATE_LENGTH) fade.style.display = 'none';
  }

  function buildHighlightCard(item) {
    var fullBody = item.body || '';
    var isLong = fullBody.length > TEXT_TRUNCATE_LENGTH;
    var author = (item.author || '').trim();
    var sourceTitle = (item.sourceTitle || '').trim();
    var hasAuthor = author.length > 0;
    var hasSource = sourceTitle.length > 0;
    var showSource = hasAuthor || hasSource;
    var sourceText = hasAuthor && hasSource ? author + ' • ' + sourceTitle : (author || sourceTitle);

    var card = document.createElement('div');
    card.className = 'sublime-feed__card sublime-card sublime-card--highlight';
    card.setAttribute('role', 'article');
    card.setAttribute('data-body-length', String(fullBody.length));
    if (isLong) card._fullBody = fullBody;

    var bodyWrap = document.createElement('div');
    bodyWrap.className = 'sublime-card__body-wrap';
    var bodyEl = document.createElement('div');
    bodyEl.className = 'sublime-card__body';
    bodyEl.textContent = isLong ? fullBody.substring(0, TEXT_TRUNCATE_LENGTH) : fullBody;
    var fadeEl = document.createElement('div');
    fadeEl.className = 'sublime-card__fade';
    fadeEl.setAttribute('aria-hidden', 'true');
    bodyWrap.appendChild(bodyEl);
    bodyWrap.appendChild(fadeEl);
    if (isLong) {
      var expandHit = document.createElement('div');
      expandHit.className = 'sublime-card__expand-hit';
      expandHit.setAttribute('aria-label', 'Expand text');
      expandHit.setAttribute('data-expand-for', 'body');
      bodyWrap.appendChild(expandHit);
      var expandWrap = document.createElement('div');
      expandWrap.className = 'sublime-card__expand-wrap';
      var lessBtn = document.createElement('button');
      lessBtn.type = 'button';
      lessBtn.className = 'sublime-card__less-btn';
      lessBtn.textContent = 'less';
      lessBtn.setAttribute('aria-label', 'Collapse text');
      lessBtn.setAttribute('data-collapse-for', 'body');
      lessBtn.style.display = 'none';
      expandWrap.appendChild(lessBtn);
      bodyWrap.appendChild(expandWrap);
    }
    card.appendChild(bodyWrap);

    if (showSource) {
      var sourceEl = document.createElement('div');
      sourceEl.className = 'sublime-card__source';
      sourceEl.textContent = sourceText;
      card.appendChild(sourceEl);
    }

    return card;
  }

  function buildImageCard(item) {
    var src = item.src || '';
    var fullCaption = (item.caption || '').trim();
    var caption = fullCaption.length > IMAGE_CAPTION_TRUNCATE_LENGTH ? fullCaption.substring(0, IMAGE_CAPTION_TRUNCATE_LENGTH) : fullCaption;
    var author = (item.author || '').trim();
    var sourceTitle = (item.sourceTitle || '').trim();
    var hasCaption = fullCaption.length > 0;
    var hasAuthor = author.length > 0;
    var hasSource = sourceTitle.length > 0;
    var showCaptionBlock = hasCaption || hasAuthor || hasSource;
    var sourceText = hasAuthor && hasSource ? author + ' • ' + sourceTitle : (author || sourceTitle);

    var card = document.createElement('div');
    card.className = 'sublime-feed__card sublime-card sublime-card--image';
    card.setAttribute('role', 'article');

    var imgWrap = document.createElement('div');
    imgWrap.className = 'sublime-card__img-wrap';
    var img = document.createElement('img');
    img.className = 'sublime-card__img';
    img.src = src;
    img.alt = caption || '';
    img.loading = 'lazy';
    imgWrap.appendChild(img);
    card.appendChild(imgWrap);

    if (showCaptionBlock) {
      var captionWrap = document.createElement('div');
      captionWrap.className = 'sublime-card__caption-wrap';
      if (hasCaption) {
        var captionTextWrap = document.createElement('div');
        captionTextWrap.className = 'sublime-card__caption-text-wrap';
        var captionEl = document.createElement('div');
        captionEl.className = 'sublime-card__caption';
        captionEl.textContent = caption;
        captionTextWrap.appendChild(captionEl);
        var isCaptionLong = fullCaption.length > IMAGE_CAPTION_TRUNCATE_LENGTH;
        if (isCaptionLong) {
          card._fullCaption = fullCaption;
          var captionFade = document.createElement('div');
          captionFade.className = 'sublime-card__fade';
          captionFade.setAttribute('aria-hidden', 'true');
          captionTextWrap.appendChild(captionFade);
          var expandHit = document.createElement('div');
          expandHit.className = 'sublime-card__expand-hit';
          expandHit.setAttribute('aria-label', 'Expand caption');
          expandHit.setAttribute('data-expand-for', 'caption');
          captionTextWrap.appendChild(expandHit);
          var expandWrap = document.createElement('div');
          expandWrap.className = 'sublime-card__expand-wrap';
          var lessBtn = document.createElement('button');
          lessBtn.type = 'button';
          lessBtn.className = 'sublime-card__less-btn';
          lessBtn.textContent = 'less';
          lessBtn.setAttribute('aria-label', 'Collapse caption');
          lessBtn.setAttribute('data-collapse-for', 'caption');
          lessBtn.style.display = 'none';
          expandWrap.appendChild(lessBtn);
          captionTextWrap.appendChild(expandWrap);
        }
        captionWrap.appendChild(captionTextWrap);
      }
      if (hasAuthor || hasSource) {
        var sourceEl = document.createElement('div');
        sourceEl.className = 'sublime-card__source';
        sourceEl.textContent = sourceText;
        captionWrap.appendChild(sourceEl);
      }
      card.appendChild(captionWrap);
    }

    return card;
  }

  /** File/PDF card: first-page preview image + optional title, caption, author, source (same pattern as image cards). */
  function buildFileCard(item) {
    var previewSrc = item.previewSrc || item.src || '';
    var fullTitle = (item.title || '').trim();
    var fullCaption = (item.caption || '').trim();
    var title = fullTitle.length > IMAGE_CAPTION_TRUNCATE_LENGTH ? fullTitle.substring(0, IMAGE_CAPTION_TRUNCATE_LENGTH) : fullTitle;
    var caption = fullCaption.length > IMAGE_CAPTION_TRUNCATE_LENGTH ? fullCaption.substring(0, IMAGE_CAPTION_TRUNCATE_LENGTH) : fullCaption;
    var author = (item.author || '').trim();
    var sourceTitle = (item.sourceTitle || '').trim();
    var hasTitle = fullTitle.length > 0;
    var hasCaption = fullCaption.length > 0;
    var hasAuthor = author.length > 0;
    var hasSource = sourceTitle.length > 0;
    var showMetaBlock = hasTitle || hasCaption || hasAuthor || hasSource;
    var sourceText = hasAuthor && hasSource ? author + ' • ' + sourceTitle : (author || sourceTitle);

    var card = document.createElement('div');
    card.className = 'sublime-feed__card sublime-card sublime-card--file';
    card.setAttribute('role', 'article');

    var imgWrap = document.createElement('div');
    imgWrap.className = 'sublime-card__img-wrap';
    var img = document.createElement('img');
    img.className = 'sublime-card__img';
    img.src = previewSrc;
    img.alt = fullTitle || fullCaption || '';
    img.loading = 'lazy';
    imgWrap.appendChild(img);
    card.appendChild(imgWrap);

    if (showMetaBlock) {
      var metaWrap = document.createElement('div');
      metaWrap.className = 'sublime-card__caption-wrap';
      if (hasTitle) {
        var titleTextWrap = document.createElement('div');
        titleTextWrap.className = 'sublime-card__caption-text-wrap';
        var titleEl = document.createElement('div');
        titleEl.className = 'sublime-card__title';
        titleEl.textContent = title;
        titleTextWrap.appendChild(titleEl);
        if (fullTitle.length > IMAGE_CAPTION_TRUNCATE_LENGTH) {
          card._fullTitle = fullTitle;
          var titleFade = document.createElement('div');
          titleFade.className = 'sublime-card__fade';
          titleFade.setAttribute('aria-hidden', 'true');
          titleTextWrap.appendChild(titleFade);
          var expandHit = document.createElement('div');
          expandHit.className = 'sublime-card__expand-hit';
          expandHit.setAttribute('aria-label', 'Expand title');
          expandHit.setAttribute('data-expand-for', 'title');
          titleTextWrap.appendChild(expandHit);
          var expandWrap = document.createElement('div');
          expandWrap.className = 'sublime-card__expand-wrap';
          var lessBtn = document.createElement('button');
          lessBtn.type = 'button';
          lessBtn.className = 'sublime-card__less-btn';
          lessBtn.textContent = 'less';
          lessBtn.setAttribute('aria-label', 'Collapse title');
          lessBtn.setAttribute('data-collapse-for', 'title');
          lessBtn.style.display = 'none';
          expandWrap.appendChild(lessBtn);
          titleTextWrap.appendChild(expandWrap);
        }
        metaWrap.appendChild(titleTextWrap);
      }
      if (hasCaption) {
        var captionTextWrap = document.createElement('div');
        captionTextWrap.className = 'sublime-card__caption-text-wrap';
        var captionEl = document.createElement('div');
        captionEl.className = 'sublime-card__caption';
        captionEl.textContent = caption;
        captionTextWrap.appendChild(captionEl);
        if (fullCaption.length > IMAGE_CAPTION_TRUNCATE_LENGTH) {
          card._fullCaption = fullCaption;
          var captionFade = document.createElement('div');
          captionFade.className = 'sublime-card__fade';
          captionFade.setAttribute('aria-hidden', 'true');
          captionTextWrap.appendChild(captionFade);
          var expandHit = document.createElement('div');
          expandHit.className = 'sublime-card__expand-hit';
          expandHit.setAttribute('aria-label', 'Expand caption');
          expandHit.setAttribute('data-expand-for', 'caption');
          captionTextWrap.appendChild(expandHit);
          var expandWrap = document.createElement('div');
          expandWrap.className = 'sublime-card__expand-wrap';
          var lessBtn = document.createElement('button');
          lessBtn.type = 'button';
          lessBtn.className = 'sublime-card__less-btn';
          lessBtn.textContent = 'less';
          lessBtn.setAttribute('aria-label', 'Collapse caption');
          lessBtn.setAttribute('data-collapse-for', 'caption');
          lessBtn.style.display = 'none';
          expandWrap.appendChild(lessBtn);
          captionTextWrap.appendChild(expandWrap);
        }
        metaWrap.appendChild(captionTextWrap);
      }
      if (hasAuthor || hasSource) {
        var sourceEl = document.createElement('div');
        sourceEl.className = 'sublime-card__source';
        sourceEl.textContent = sourceText;
        metaWrap.appendChild(sourceEl);
      }
      card.appendChild(metaWrap);
    }

    return card;
  }

  /** Video card: native MP4 (autoplay loop muted preview) or later YouTube embed. Play icon bottom-left. Optional title, caption, author, source. */
  function buildVideoCard(item) {
    var videoSrc = item.videoSrc || item.src || '';
    var fullTitle = (item.title || '').trim();
    var fullCaption = (item.caption || '').trim();
    var title = fullTitle.length > IMAGE_CAPTION_TRUNCATE_LENGTH ? fullTitle.substring(0, IMAGE_CAPTION_TRUNCATE_LENGTH) : fullTitle;
    var caption = fullCaption.length > IMAGE_CAPTION_TRUNCATE_LENGTH ? fullCaption.substring(0, IMAGE_CAPTION_TRUNCATE_LENGTH) : fullCaption;
    var author = (item.author || '').trim();
    var sourceTitle = (item.sourceTitle || '').trim();
    var hasTitle = fullTitle.length > 0;
    var hasCaption = fullCaption.length > 0;
    var hasAuthor = author.length > 0;
    var hasSource = sourceTitle.length > 0;
    var showMetaBlock = hasTitle || hasCaption || hasAuthor || hasSource;
    var sourceText = hasAuthor && hasSource ? author + ' • ' + sourceTitle : (author || sourceTitle);
    var isNative = videoSrc.length > 0 && !/youtube\.com|youtu\.be/i.test(videoSrc);

    var card = document.createElement('div');
    card.className = 'sublime-feed__card sublime-card sublime-card--video';
    card.setAttribute('role', 'article');

    var videoWrap = document.createElement('div');
    videoWrap.className = 'sublime-card__video-wrap';
    if (isNative) {
      var video = document.createElement('video');
      video.className = 'sublime-card__video';
      video.src = videoSrc;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.autoplay = true;
      video.setAttribute('aria-label', fullTitle || 'Video');
      videoWrap.appendChild(video);
    }
    var playIcon = document.createElement('div');
    playIcon.className = 'sublime-card__play-icon';
    playIcon.setAttribute('aria-hidden', 'true');
    playIcon.innerHTML = '<svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="17.5" cy="17.5" r="16" fill="rgba(0,0,0,0.5)"/><g transform="translate(17.5,17.5) scale(0.714) translate(-17.5,-17.5)"><path d="M11.4622 7.03445C10.64 7.01488 9.69553 7.05158 9.09114 7.69023C8.45005 8.3044 8.38642 9.45934 8.31791 10.2962C8.2445 13.071 8.33748 15.8507 8.27142 18.6255C8.16865 20.4998 8.14418 22.3791 8.18578 24.2558C8.1344 25.7093 9.12539 27.4099 10.4761 27.9678C11.7999 28.0192 13.2705 27.3438 14.4425 26.7639C17.9343 25.2346 21.3282 23.4826 24.815 21.9435C26.1975 21.3146 27.8541 20.5365 28.7056 19.2225C29.6232 17.5464 29.1338 15.3735 27.5654 14.2675C25.4904 12.8899 22.9382 12.0359 20.7213 10.8345C18.4848 9.79947 16.2557 8.73995 13.9948 7.75874C13.175 7.38681 12.3822 7.04914 11.4622 7.03445Z" fill="#fff"/></g></svg>';
    videoWrap.appendChild(playIcon);
    card.appendChild(videoWrap);

    if (showMetaBlock) {
      var metaWrap = document.createElement('div');
      metaWrap.className = 'sublime-card__caption-wrap';
      if (hasTitle) {
        var titleTextWrap = document.createElement('div');
        titleTextWrap.className = 'sublime-card__caption-text-wrap';
        var titleEl = document.createElement('div');
        titleEl.className = 'sublime-card__title';
        titleEl.textContent = title;
        titleTextWrap.appendChild(titleEl);
        if (fullTitle.length > IMAGE_CAPTION_TRUNCATE_LENGTH) {
          card._fullTitle = fullTitle;
          var titleFade = document.createElement('div');
          titleFade.className = 'sublime-card__fade';
          titleFade.setAttribute('aria-hidden', 'true');
          titleTextWrap.appendChild(titleFade);
          var expandHit = document.createElement('div');
          expandHit.className = 'sublime-card__expand-hit';
          expandHit.setAttribute('aria-label', 'Expand title');
          expandHit.setAttribute('data-expand-for', 'title');
          titleTextWrap.appendChild(expandHit);
          var expandWrap = document.createElement('div');
          expandWrap.className = 'sublime-card__expand-wrap';
          var lessBtn = document.createElement('button');
          lessBtn.type = 'button';
          lessBtn.className = 'sublime-card__less-btn';
          lessBtn.textContent = 'less';
          lessBtn.setAttribute('aria-label', 'Collapse title');
          lessBtn.setAttribute('data-collapse-for', 'title');
          lessBtn.style.display = 'none';
          expandWrap.appendChild(lessBtn);
          titleTextWrap.appendChild(expandWrap);
        }
        metaWrap.appendChild(titleTextWrap);
      }
      if (hasCaption) {
        var captionTextWrap = document.createElement('div');
        captionTextWrap.className = 'sublime-card__caption-text-wrap';
        var captionEl = document.createElement('div');
        captionEl.className = 'sublime-card__caption';
        captionEl.textContent = caption;
        captionTextWrap.appendChild(captionEl);
        if (fullCaption.length > IMAGE_CAPTION_TRUNCATE_LENGTH) {
          card._fullCaption = fullCaption;
          var captionFade = document.createElement('div');
          captionFade.className = 'sublime-card__fade';
          captionFade.setAttribute('aria-hidden', 'true');
          captionTextWrap.appendChild(captionFade);
          var expandHit = document.createElement('div');
          expandHit.className = 'sublime-card__expand-hit';
          expandHit.setAttribute('aria-label', 'Expand caption');
          expandHit.setAttribute('data-expand-for', 'caption');
          captionTextWrap.appendChild(expandHit);
          var expandWrap = document.createElement('div');
          expandWrap.className = 'sublime-card__expand-wrap';
          var lessBtn = document.createElement('button');
          lessBtn.type = 'button';
          lessBtn.className = 'sublime-card__less-btn';
          lessBtn.textContent = 'less';
          lessBtn.setAttribute('aria-label', 'Collapse caption');
          lessBtn.setAttribute('data-collapse-for', 'caption');
          lessBtn.style.display = 'none';
          expandWrap.appendChild(lessBtn);
          captionTextWrap.appendChild(expandWrap);
        }
        metaWrap.appendChild(captionTextWrap);
      }
      if (hasAuthor || hasSource) {
        var sourceEl = document.createElement('div');
        sourceEl.className = 'sublime-card__source';
        sourceEl.textContent = sourceText;
        metaWrap.appendChild(sourceEl);
      }
      card.appendChild(metaWrap);
    }

    return card;
  }

  function buildCard(item) {
    if (item.type === 'text') return buildTextCard(item);
    if (item.type === 'highlight') return buildHighlightCard(item);
    if (item.type === 'image') return buildImageCard(item);
    if (item.type === 'file') return buildFileCard(item);
    if (item.type === 'video') return buildVideoCard(item);
    return null;
  }

  /** Wraps any feed card in a shell with hover overlay + save/share/more actions. Applies to all card types. */
  function wrapCardWithShell(cardEl) {
    var shell = document.createElement('div');
    shell.className = 'sublime-card-shell';
    var overlay = document.createElement('div');
    overlay.className = 'sublime-card-shell__overlay';
    overlay.setAttribute('aria-hidden', 'true');
    var actions = document.createElement('div');
    actions.className = 'sublime-card-shell__actions';
    actions.setAttribute('aria-label', 'Card actions');
    var left = document.createElement('div');
    left.className = 'sublime-card-shell__actions-left';
    var shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.className = 'sublime-card-shell__action sublime-card-shell__action--share';
    shareBtn.setAttribute('aria-label', 'Share');
    var shareImg = document.createElement('img');
    shareImg.src = '../assets/SHARE.svg';
    shareImg.alt = '';
    shareImg.width = 35;
    shareImg.height = 35;
    shareBtn.appendChild(shareImg);
    var moreBtn = document.createElement('button');
    moreBtn.type = 'button';
    moreBtn.className = 'sublime-card-shell__action sublime-card-shell__action--more';
    moreBtn.setAttribute('aria-label', 'More actions');
    moreBtn.setAttribute('aria-haspopup', 'true');
    var moreImg = document.createElement('img');
    moreImg.src = '../assets/MORE-MENU.svg';
    moreImg.alt = '';
    moreImg.width = 35;
    moreImg.height = 35;
    moreBtn.appendChild(moreImg);
    left.appendChild(shareBtn);
    left.appendChild(moreBtn);
    var right = document.createElement('div');
    right.className = 'sublime-card-shell__actions-right';
    var saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'sublime-card-shell__action sublime-card-shell__action--save';
    saveBtn.setAttribute('aria-label', 'Save to library');
    saveBtn.textContent = 'save';
    right.appendChild(saveBtn);
    actions.appendChild(left);
    actions.appendChild(right);
    shell.appendChild(cardEl);
    shell.appendChild(overlay);
    shell.appendChild(actions);
    shareBtn.addEventListener('click', function (e) { e.stopPropagation(); });
    moreBtn.addEventListener('click', function (e) { e.stopPropagation(); });
    saveBtn.addEventListener('click', function (e) { e.stopPropagation(); });
    return shell;
  }

  /** Fisher–Yates shuffle. Returns a new shuffled array; does not mutate the original. */
  function shuffleArray(arr) {
    var out = arr.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = out[i];
      out[i] = out[j];
      out[j] = tmp;
    }
    return out;
  }

  /**
   * Renders the feed: two columns, strict left-right alternation (card 0 → col1, 1 → col2, 2 → col1, …).
   * All vertical spacing between cards = 80px (CSS). All horizontal spacing between columns = 80px (CSS).
   * Scalable for any card/media type; no height-based logic.
   */
  function renderSublimeFeed() {
    var col1 = document.getElementById('sublime-feed-col-1');
    var col2 = document.getElementById('sublime-feed-col-2');
    if (!col1 || !col2) return;
    col1.textContent = '';
    col2.textContent = '';
    var cards = activeSublimeCategory === 'staff-picks' ? shuffleArray(staffPicksFeedCards) : [];
    for (var i = 0; i < cards.length; i++) {
      var card = buildCard(cards[i]);
      if (!card) continue;
      var shell = wrapCardWithShell(card);
      (i % 2 === 0 ? col1 : col2).appendChild(shell);
    }
    requestAnimationFrame(function () {
      document.querySelectorAll('.sublime-card--text, .sublime-card--highlight').forEach(hideExpandIfNotTruncated);
    });
  }

  /** Expand/collapse truncated text: click on fade area (expand-hit) expands; "less" collapses. Supports body (text/highlight), caption, title (image/file/video). */
  function onSublimeFeedClick(e) {
    var expandHit = e.target.closest('.sublime-card__expand-hit');
    var lessBtn = e.target.closest('.sublime-card__less-btn');
    if (!expandHit && !lessBtn) return;
    var card = (expandHit || lessBtn).closest('.sublime-feed__card');
    if (!card) return;
    var wrap = (expandHit || lessBtn).closest('.sublime-card__body-wrap, .sublime-card__caption-text-wrap');
    if (!wrap) return;
    var expandFor = expandHit ? expandHit.getAttribute('data-expand-for') : lessBtn.getAttribute('data-collapse-for');
    if (!expandFor) return;
    var fullText;
    var truncLen;
    if (expandFor === 'body') {
      fullText = card._fullBody;
      truncLen = TEXT_TRUNCATE_LENGTH;
    } else if (expandFor === 'title') {
      fullText = card._fullTitle;
      truncLen = IMAGE_CAPTION_TRUNCATE_LENGTH;
    } else {
      fullText = card._fullCaption;
      truncLen = IMAGE_CAPTION_TRUNCATE_LENGTH;
    }
    if (!fullText) return;
    var textEl = wrap.querySelector('.sublime-card__body, .sublime-card__caption, .sublime-card__title');
    var fadeEl = wrap.querySelector('.sublime-card__fade');
    var hitEl = wrap.querySelector('.sublime-card__expand-hit');
    var expandWrap = wrap.querySelector('.sublime-card__expand-wrap');
    var lessB = expandWrap && expandWrap.querySelector('.sublime-card__less-btn');
    if (!textEl || !expandWrap) return;
    if (expandHit) {
      textEl.textContent = fullText;
      if (fadeEl) fadeEl.style.display = 'none';
      if (hitEl) hitEl.style.display = 'none';
      if (lessB) lessB.style.display = '';
      wrap.classList.add('is-expanded');
    } else {
      textEl.textContent = fullText.length > truncLen ? fullText.substring(0, truncLen) : fullText;
      if (fadeEl) fadeEl.style.display = '';
      if (hitEl) hitEl.style.display = '';
      if (lessB) lessB.style.display = 'none';
      wrap.classList.remove('is-expanded');
    }
  }

  var sublimeFeed = document.querySelector('.sublime-feed');
  if (sublimeFeed) sublimeFeed.addEventListener('click', onSublimeFeedClick);

  renderSublimeFeed();

  // --- Collection landing page ---
  var collectionBackBtn = document.getElementById('collection-back-btn');
  var collectionContent = document.getElementById('collection-content');
  var collectionTopBar = document.getElementById('collection-top-bar');
  var collectionTitleMini = document.getElementById('collection-title-mini');
  var collectionHeaderTitle = document.getElementById('collection-header-title');
  var collectionHeaderSubtitle = document.getElementById('collection-header-subtitle');
  var collectionHeaderMeta = document.getElementById('collection-header-meta');
  var collectionHeaderCount = document.getElementById('collection-header-count');
  var collectionFeedCol1 = document.getElementById('collection-feed-col-1');
  var collectionFeedCol2 = document.getElementById('collection-feed-col-2');
  var collectionHeaderEl = document.getElementById('collection-header');
  var collectionMiniObserver = null;
  var collectionMiniRafId = null;

  function renderCollectionFeed(name, count) {
    if (collectionTitleMini) collectionTitleMini.textContent = 'Dialogo';
    if (collectionHeaderTitle) collectionHeaderTitle.textContent = 'Dialogo';
    if (collectionHeaderCount) collectionHeaderCount.textContent = '44';
    if (!collectionFeedCol1 || !collectionFeedCol2) return;
    collectionFeedCol1.textContent = '';
    collectionFeedCol2.textContent = '';
    var cards = shuffleArray(staffPicksFeedCards);
    for (var i = 0; i < cards.length; i++) {
      var card = buildCard(cards[i]);
      if (!card) continue;
      var shell = wrapCardWithShell(card);
      (i % 2 === 0 ? collectionFeedCol1 : collectionFeedCol2).appendChild(shell);
    }
    requestAnimationFrame(function () {
      if (collectionView) collectionView.querySelectorAll('.sublime-card--text, .sublime-card--highlight').forEach(hideExpandIfNotTruncated);
    });
  }

  function openCollection(name, count) {
    if (!collectionView || !libraryView) return;
    libraryView.classList.remove('library-view--visible');
    libraryView.setAttribute('aria-hidden', 'true');
    collectionView.classList.add('collection-view--visible');
    collectionView.setAttribute('aria-hidden', 'false');
    renderCollectionFeed(name, count);
    if (collectionTopBar) collectionTopBar.classList.remove('collection-top-bar--mini');
    if (collectionContent) collectionContent.scrollTop = 0;
    setTimeout(startCollectionMiniObserver, 100);
  }

  function closeCollection() {
    if (!collectionView || !libraryView) return;
    stopCollectionMiniObserver();
    collectionView.classList.remove('collection-view--visible');
    collectionView.setAttribute('aria-hidden', 'true');
    libraryView.classList.add('library-view--visible');
    libraryView.setAttribute('aria-hidden', 'false');
    if (addWrap) addWrap.classList.remove('add-menu--on-collection');
  }

  function setCollectionMiniVisible(show) {
    if (!collectionTopBar) return;
    collectionTopBar.classList.toggle('collection-top-bar--mini', show);
  }

  function checkCollectionMiniFromScroll() {
    if (!collectionHeaderEl || !collectionTopBar || !collectionView || !collectionView.classList.contains('collection-view--visible')) return;
    var rect = collectionHeaderEl.getBoundingClientRect();
    var topBarHeight = collectionTopBar.offsetHeight || 76;
    var showMini = rect.bottom < topBarHeight;
    setCollectionMiniVisible(showMini);
  }

  function collectionMiniRafLoop() {
    if (!collectionView || !collectionView.classList.contains('collection-view--visible')) {
      collectionMiniRafId = null;
      return;
    }
    checkCollectionMiniFromScroll();
    collectionMiniRafId = requestAnimationFrame(collectionMiniRafLoop);
  }

  function startCollectionMiniObserver() {
    stopCollectionMiniObserver();
    if (!collectionTopBar || !collectionHeaderEl) return;
    var runObserver = function () {
      if (!collectionView || !collectionView.classList.contains('collection-view--visible')) return;
      collectionMiniObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            setCollectionMiniVisible(!entry.isIntersecting);
          });
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0
        }
      );
      collectionMiniObserver.observe(collectionHeaderEl);
    };
    requestAnimationFrame(function () {
      requestAnimationFrame(runObserver);
    });
    if (collectionContent) {
      collectionContent.addEventListener('scroll', checkCollectionMiniFromScroll, { passive: true });
      collectionContent.addEventListener('touchmove', checkCollectionMiniFromScroll, { passive: true });
    }
    window.addEventListener('scroll', checkCollectionMiniFromScroll, { passive: true });
    document.addEventListener('scroll', checkCollectionMiniFromScroll, { passive: true });
    if (collectionMiniRafId !== null) cancelAnimationFrame(collectionMiniRafId);
    collectionMiniRafId = requestAnimationFrame(collectionMiniRafLoop);
  }

  function stopCollectionMiniObserver() {
    if (collectionMiniObserver) {
      collectionMiniObserver.disconnect();
      collectionMiniObserver = null;
    }
    if (collectionMiniRafId !== null) {
      cancelAnimationFrame(collectionMiniRafId);
      collectionMiniRafId = null;
    }
    if (collectionContent) {
      collectionContent.removeEventListener('scroll', checkCollectionMiniFromScroll);
      collectionContent.removeEventListener('touchmove', checkCollectionMiniFromScroll);
    }
    window.removeEventListener('scroll', checkCollectionMiniFromScroll);
    document.removeEventListener('scroll', checkCollectionMiniFromScroll);
  }

  document.querySelectorAll('.library-pinned-item').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var label = link.querySelector('.library-pinned-label');
      var countEl = link.querySelector('.library-pinned-count');
      var name = label ? label.textContent.trim() : 'Collection';
      var count = countEl ? countEl.textContent.trim() : '0';
      openCollection(name, count);
    });
  });

  if (collectionBackBtn) {
    collectionBackBtn.addEventListener('click', closeCollection);
  }

  var collectionFeed = document.querySelector('.collection-feed');
  if (collectionFeed) collectionFeed.addEventListener('click', onSublimeFeedClick);

  // Click sound: new Audio per click so it always works (no reuse = no browser blocking)
  document.addEventListener('mousedown', function (e) {
    if (!e.target.closest('button')) return;
    var a = new Audio('../assets/click.mp3');
    a.play().catch(function () {});
  }, true);

  function setActive(tab) {
    if (tab !== 'sublime' && tab !== 'library' && tab !== 'inbox' && tab !== 'profile') return;
    activeTab = tab;
    navItems.forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-tab') === tab);
    });
    if (addBtn) addBtn.classList.toggle('is-visible', tab === 'library');
    if (tab !== 'library' && addWrap) addWrap.classList.remove('is-expanded');
    if (collectionView) {
      collectionView.classList.remove('collection-view--visible');
      collectionView.setAttribute('aria-hidden', 'true');
      if (addWrap) addWrap.classList.remove('add-menu--on-collection');
    }
    if (libraryView) {
      libraryView.classList.toggle('library-view--visible', tab === 'library');
      libraryView.setAttribute('aria-hidden', tab !== 'library');
    }
    if (sublimeView) {
      sublimeView.classList.toggle('sublime-view--visible', tab === 'sublime');
      sublimeView.setAttribute('aria-hidden', tab !== 'sublime');
    }
    if (inboxView) {
      inboxView.classList.toggle('inbox-view--visible', tab === 'inbox');
      inboxView.setAttribute('aria-hidden', tab !== 'inbox');
    }
    if (profileView) {
      profileView.classList.toggle('profile-view--visible', tab === 'profile');
      profileView.setAttribute('aria-hidden', tab !== 'profile');
    }
  }

  navItems.forEach(function (el) {
    el.addEventListener('click', function () {
      var tab = el.getAttribute('data-tab');
      var onCollection = collectionView && collectionView.classList.contains('collection-view--visible');
      if (tab === activeTab && !onCollection) return;
      setActive(tab);
    });
  });

  if (addBtn) addBtn.classList.toggle('is-visible', activeTab === 'library');
  if (libraryView) {
    libraryView.classList.toggle('library-view--visible', activeTab === 'library');
    libraryView.setAttribute('aria-hidden', activeTab !== 'library');
  }
  if (sublimeView) {
    sublimeView.classList.toggle('sublime-view--visible', activeTab === 'sublime');
    sublimeView.setAttribute('aria-hidden', activeTab !== 'sublime');
  }
  if (inboxView) {
    inboxView.classList.toggle('inbox-view--visible', activeTab === 'inbox');
    inboxView.setAttribute('aria-hidden', activeTab !== 'inbox');
  }
  if (profileView) {
    profileView.classList.toggle('profile-view--visible', activeTab === 'profile');
    profileView.setAttribute('aria-hidden', activeTab !== 'profile');
  }

  // Plus button: toggle actions menu and rotate icon; menu content depends on context (library vs collection landing)
  if (addBtn && addWrap) {
    addBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (!addBtn.classList.contains('is-visible')) return;
      addWrap.classList.toggle('is-expanded');
      addBtn.setAttribute('aria-expanded', addWrap.classList.contains('is-expanded'));
      if (addMenu) addMenu.setAttribute('aria-hidden', !addWrap.classList.contains('is-expanded'));
      if (addWrap.classList.contains('is-expanded')) {
        if (collectionView && collectionView.classList.contains('collection-view--visible')) {
          addWrap.classList.add('add-menu--on-collection');
        } else {
          addWrap.classList.remove('add-menu--on-collection');
        }
      }
    });
  }

  // Click outside to close menu
  document.addEventListener('click', function () {
    if (addWrap && addWrap.classList.contains('is-expanded')) {
      addWrap.classList.remove('is-expanded');
      if (addBtn) addBtn.setAttribute('aria-expanded', 'false');
      if (addMenu) addMenu.setAttribute('aria-hidden', 'true');
    }
  });

  // Prevent menu clicks from closing (they bubble to document)
  if (addMenu) {
    addMenu.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  // Action buttons (placeholder handlers)
  document.querySelectorAll('.nav-add-e2-action[data-action]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (this.getAttribute('data-action') === 'import') return;
      var action = this.getAttribute('data-action');
      console.log('Action:', action);
    });
  });

  document.querySelectorAll('.nav-add-e2-submenu-item').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var source = this.getAttribute('data-import');
      console.log('Import from:', source);
    });
  });

  // Import submenu: hover with delay; open/close state on section so submenu can bottom-align with it
  var importSection = document.getElementById('import-section');
  var importRow = document.getElementById('import-row');
  var importSubmenu = document.getElementById('import-submenu');
  var submenuCloseTimer = null;
  var SUBMENU_CLOSE_DELAY = 200;

  function openSubmenu() {
    if (!importSection || !importSubmenu) return;
    if (submenuCloseTimer) {
      clearTimeout(submenuCloseTimer);
      submenuCloseTimer = null;
    }
    importSection.classList.add('is-submenu-open');
    importRow?.querySelector('.nav-add-e2-action[data-action="import"]')?.setAttribute('aria-expanded', 'true');
    positionSubmenu();
  }

  function closeSubmenu() {
    if (!importSection) return;
    importSection.classList.remove('is-submenu-open');
    importRow?.querySelector('.nav-add-e2-action[data-action="import"]')?.setAttribute('aria-expanded', 'false');
  }

  function scheduleCloseSubmenu() {
    if (submenuCloseTimer) clearTimeout(submenuCloseTimer);
    submenuCloseTimer = setTimeout(function () {
      submenuCloseTimer = null;
      closeSubmenu();
    }, SUBMENU_CLOSE_DELAY);
  }

  function positionSubmenu() {
    if (!importSubmenu || !importSection) return;
    importSubmenu.classList.remove('nav-add-e2-submenu--open-up');
    importSubmenu.offsetHeight;
    var sectionRect = importSection.getBoundingClientRect();
    var submenuHeight = importSubmenu.offsetHeight;
    var viewportH = window.innerHeight;
    var safeMargin = 16;
    var wouldGoBelow = sectionRect.top + submenuHeight > viewportH - safeMargin;
    if (wouldGoBelow) {
      importSubmenu.classList.add('nav-add-e2-submenu--open-up');
    }
  }

  if (importSection && importRow && importSubmenu) {
    importRow.addEventListener('mouseenter', openSubmenu);
    importRow.addEventListener('mouseleave', scheduleCloseSubmenu);
    importSubmenu.addEventListener('mouseenter', openSubmenu);
    importSubmenu.addEventListener('mouseleave', scheduleCloseSubmenu);
  }

  // Close Import submenu when main add menu closes
  if (addWrap) {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.attributeName === 'class' && !addWrap.classList.contains('is-expanded')) {
          closeSubmenu();
        }
      });
    });
    observer.observe(addWrap, { attributes: true });
  }

  // Library view: category filter buttons (single active)
  document.querySelectorAll('.library-filter-btn[data-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.library-filter-btn').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  // Library view: media type buttons (placeholder)
  document.querySelectorAll('.library-media-btn[data-media]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var media = this.getAttribute('data-media');
      console.log('Media filter:', media);
    });
  });

  // Library search: show close icon when user types, typed text is black (via CSS)
  var searchWrap = document.getElementById('library-search-wrap');
  var searchInput = document.getElementById('library-search-input');
  var searchClear = document.getElementById('library-search-clear');

  function updateSearchState() {
    var hasValue = searchInput && searchInput.value.trim().length > 0;
    if (searchWrap) {
      searchWrap.classList.toggle('has-value', hasValue);
    }
    if (searchClear) {
      searchClear.setAttribute('aria-hidden', !hasValue);
      searchClear.setAttribute('tabindex', hasValue ? '0' : '-1');
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', updateSearchState);
    searchInput.addEventListener('keyup', updateSearchState);
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      searchInput.focus();
      updateSearchState();
    });
  }

  // Sublime view: category buttons (Staff picks / Following) — single active; feed only for Staff picks
  var sublimeTopBarInner = document.querySelector('.sublime-top-bar-inner');
  document.querySelectorAll('.sublime-category-btn[data-sublime]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sublime = this.getAttribute('data-sublime');
      if (sublime === activeSublimeCategory) return;
      document.querySelectorAll('.sublime-category-btn').forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');
      activeSublimeCategory = sublime;
      if (sublimeTopBarInner) {
        sublimeTopBarInner.classList.toggle('sublime-top-bar-inner--following', sublime === 'following');
      }
      renderSublimeFeed();
    });
  });

  // Sublime search: show clear icon when user types (same behavior as library search)
  var sublimeSearchWrap = document.getElementById('sublime-search-wrap');
  var sublimeSearchInput = document.getElementById('sublime-search-input');
  var sublimeSearchClear = document.getElementById('sublime-search-clear');

  function updateSublimeSearchState() {
    var hasValue = sublimeSearchInput && sublimeSearchInput.value.trim().length > 0;
    if (sublimeSearchWrap) {
      sublimeSearchWrap.classList.toggle('has-value', hasValue);
    }
    if (sublimeSearchClear) {
      sublimeSearchClear.setAttribute('aria-hidden', !hasValue);
      sublimeSearchClear.setAttribute('tabindex', hasValue ? '0' : '-1');
    }
  }

  if (sublimeSearchInput) {
    sublimeSearchInput.addEventListener('input', updateSublimeSearchState);
    sublimeSearchInput.addEventListener('keyup', updateSublimeSearchState);
  }

  if (sublimeSearchClear && sublimeSearchInput) {
    sublimeSearchClear.addEventListener('click', function () {
      sublimeSearchInput.value = '';
      sublimeSearchInput.focus();
      updateSublimeSearchState();
    });
  }
})();
