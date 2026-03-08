(function () {
  var activeTab = 'library';
  var navItems = document.querySelectorAll('.nav-e3-item[data-tab], .nav-e3-profile-wrap[data-tab]');
  var addBtn = document.querySelector('.nav-add-e2');
  var addWrap = document.querySelector('.nav-add-e2-wrap');
  var addMenu = document.getElementById('add-menu');
  var libraryView = document.getElementById('library-view');
  var sublimeView = document.getElementById('sublime-view');
  var inboxView = document.getElementById('inbox-view');
  var profileView = document.getElementById('profile-view');
  var collectionView = document.getElementById('collection-view');
  var allCardsView = document.getElementById('all-cards-view');
  var collectionsDirectoryView = document.getElementById('collections-directory-view');
  var addLinkView = document.getElementById('add-link-view');
  var addUploadView = document.getElementById('add-upload-view');
  var addCollectionView = document.getElementById('add-collection-view');
  var addCanvasView = document.getElementById('add-canvas-view');
  var addNoteView = document.getElementById('add-note-view');
  var saveFromCardOverlay = document.getElementById('save-from-card-overlay');
  var saveFromCardModal = document.getElementById('save-from-card-modal');
  var saveFromCardForm = document.getElementById('save-from-card-form');

  var pendingSaveCard = null; /* { saveBtn, saveText, savePlusImg, shell } when modal is open */

  var viewBeforeAddLink = null;
  var viewBeforeAddUpload = null;
  var viewBeforeAddCollection = null;
  var viewBeforeAddCanvas = null;
  var viewBeforeAddNote = null;

  // Collections directory: mix of screenshot names (My Canon, Design inspiration, etc.) and pinned (Child wisdom, Artifacts, etc.)
  // Icons: PUBLIC (most), PRIVATE, PUBLIC-COLLAB = PRIVATE-COLLAB, COMMUNAL (least)
  var COLLECTIONS_DIRECTORY_DATA = [
    { name: 'My Canon', description: 'Books and essays that shaped how I think', owner: 'gabriel', count: 27, locked: false, icon: 'PUBLIC' },
    { name: 'Design inspiration', description: 'References and mood boards', owner: 'David Anastacio', count: 49, locked: false, icon: 'PUBLIC' },
    { name: 'The Art of Writing', description: 'Craft and process notes', owner: 'gabriel', count: 31, locked: true, icon: 'PRIVATE' },
    { name: 'bambiiii in th3 wiLd~!!!', description: 'Screenshots and finds', owner: 'gabriel', count: 27, locked: false, icon: 'PUBLIC' },
    { name: 'Child wisdom', description: 'Quotes and moments from the kids', owner: 'gabriel', count: 3, locked: false, icon: 'PUBLIC' },
    { name: 'Artifacts', description: 'Objects and references', owner: 'gabriel', count: 12, locked: false, icon: 'PUBLIC' },
    { name: 'Where is my 🧀🧀🧀??', description: 'Important stuff', owner: 'gabriel', count: 7, locked: false, icon: 'PRIVATE' },
    { name: 'Nice words sent my way', description: 'Kind messages and notes', owner: 'gabriel', count: 1, locked: true, icon: 'PRIVATE' },
    { name: 'Anti-Networking Event', description: 'Event prep and follow-ups', owner: 'gabriel', count: 5, locked: false, icon: 'PUBLIC-COLLAB' },
    { name: 'Reading list', description: 'To read and in progress', owner: 'gabriel', count: 18, locked: false, icon: 'PRIVATE-COLLAB' },
    { name: 'Ideas', description: 'Sparks and half-baked thoughts', owner: 'gabriel', count: 22, locked: false, icon: 'COMMUNAL' }
  ];

  // --- Staff picks feed only. Following shows empty feed. ---
  var activeSublimeCategory = 'staff-picks';

  // Activity actions for following feed
  var ACTIVITY_ACTIONS = ['added to', 'created', 'saved to', 'shared to'];

  // User names and avatars for activity feed
  var ACTIVITY_USERS = [
    { name: 'Jake', avatar: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Maarten', avatar: 'https://i.pravatar.cc/150?img=13' },
    { name: 'Nellie', avatar: 'https://i.pravatar.cc/150?img=47' },
    { name: 'John', avatar: 'https://i.pravatar.cc/150?img=15' },
    { name: 'Sarah', avatar: 'https://i.pravatar.cc/150?img=20' },
    { name: 'Alex', avatar: 'https://i.pravatar.cc/150?img=33' },
    { name: 'Emma', avatar: 'https://i.pravatar.cc/150?img=45' },
    { name: 'David', avatar: 'https://i.pravatar.cc/150?img=51' },
    { name: 'Lisa', avatar: 'https://i.pravatar.cc/150?img=32' },
    { name: 'Michael', avatar: 'https://i.pravatar.cc/150?img=28' }
  ];

  // User's library collection names (for All Cards context: "saved to X")
  var LIBRARY_COLLECTION_NAMES = [
    'Child wisdom', 'Artifacts', 'Where is my 🧀🧀🧀??', 'Nice words sent my way', 'Anti-Networking Event',
    'Design Studios', 'Movies to watch', 'Reading list', 'Ideas', 'Screenshots', 'Research', 'Inspiration'
  ];

  // Notes I may have added when saving cards (All Cards context only)
  var LIBRARY_NOTES = [
    'Save for later',
    'Key reference for the project',
    'Reminds me of the talk we had',
    'To revisit when I have more time',
    'Love this framing',
    'Share with the team',
    'Use in the deck',
    null,
    null,
    'Design inspiration',
    'Quote for the blog',
    'For the mood board',
    'Check the source again',
    null
  ];

  // Collection names relevant to different card types - more natural and varied
  var COLLECTION_NAMES = {
    highlight: ['Management and high performance', 'Music & Sustainability', 'Design Thinking', 'Leadership Insights', 'Creative Writing', 'Business Strategy', 'Personal Growth', 'fool', 'Product Strategy', 'Innovation'],
    text: ['Good design', 'Writing Collection', 'Thoughts & Ideas', 'Daily Reflections', 'Creative Notes', 'Philosophy', 'Inspiration', 'Random Thoughts', 'Ideas'],
    image: ['Visual Inspiration', 'Art & Design', 'Photography', 'Visual Storytelling', 'Creative Direction', 'Design References', 'Mood Board'],
    file: ['Research Papers', 'Business Documents', 'Design Resources', 'Learning Materials', 'Project Files', 'Resources'],
    video: ['Video Collection', 'Tutorials', 'Documentaries', 'Creative Videos', 'Learning Series', 'Videos']
  };

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

  // Following feed uses same cards as staff picks
  var followingFeedCards = staffPicksFeedCards.slice();

  // Generate activity data for a card (Following tab)
  function generateActivityForCard(cardItem, index) {
    var user = ACTIVITY_USERS[index % ACTIVITY_USERS.length];
    var action = ACTIVITY_ACTIONS[index % ACTIVITY_ACTIONS.length];
    var collections = COLLECTION_NAMES[cardItem.type] || COLLECTION_NAMES.text;
    var collectionName = collections[index % collections.length];
    
    return {
      userName: user.name,
      avatar: user.avatar,
      action: action,
      collectionName: collectionName
    };
  }

  // Sample notes for staff picks activity (including long ones for truncation testing)
  var STAFF_PICKS_NOTES = [
    'Love this quote',
    'This resonates deeply',
    'Saving for later',
    'Great insight',
    'Perfect timing',
    'Olmo and cool Sam shared this song on a car ride somewhere in the East Coast after a waterpolo match and we listened to it on repeat for hours',
    'Reminds me of something I read last week about how stories shape our understanding of the world around us',
    'Bookmarking this for my next project presentation',
    'So true - this really captures what I\'ve been thinking about lately',
    'Need to revisit this when I have more time to really digest the ideas',
    'Shared with the team and they all found it incredibly valuable',
    'This changed my perspective on how we approach design problems',
    'Worth reading twice to fully understand all the nuances',
    'Exactly what I needed to hear right now during this challenging time',
    'Saving this one to reference later when working on similar projects',
    'The way this connects different ideas is really fascinating and makes me think about my own work differently',
    'I can\'t stop thinking about this - it\'s been on my mind all day since reading it'
  ];

  // Generate staff picks activity data (users who added card publicly, with optional notes)
  function generateStaffPicksActivity(cardItem, index) {
    var numUsers = Math.floor(Math.random() * 12) + 1; // 1-12 users
    var hasNotes = Math.random() > 0.4; // 60% chance of having notes
    var usersWithNotes = hasNotes ? Math.min(Math.floor(Math.random() * 8) + 1, numUsers) : 0; // 1-8 users with notes
    
    var activities = [];
    var shuffledUsers = shuffleArray(ACTIVITY_USERS.slice());
    var shuffledNotes = shuffleArray(STAFF_PICKS_NOTES.slice());
    
    for (var i = 0; i < Math.min(numUsers, shuffledUsers.length); i++) {
      var user = shuffledUsers[i];
      var hasNote = hasNotes && i < usersWithNotes;
      activities.push({
        userName: user.name,
        avatar: user.avatar,
        note: hasNote ? shuffledNotes[i % shuffledNotes.length] : null
      });
    }
    
    return {
      activities: activities,
      totalCount: numUsers,
      usersWithNotesCount: usersWithNotes
    };
  }

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

  /** Builds activity context element (avatar + text) for following feed */
  function buildActivityContext(activity) {
    var container = document.createElement('div');
    container.className = 'sublime-activity-context';
    
    var avatar = document.createElement('img');
    avatar.className = 'sublime-activity-context__avatar';
    avatar.src = activity.avatar;
    avatar.alt = activity.userName;
    avatar.width = 24;
    avatar.height = 24;
    avatar.loading = 'lazy';
    
    var text = document.createElement('span');
    text.className = 'sublime-activity-context__text';
    
    var userName = document.createElement('span');
    userName.className = 'sublime-activity-context__user-name';
    userName.textContent = activity.userName;
    
    var actionText = document.createElement('span');
    actionText.className = 'sublime-activity-context__action';
    // Ensure proper spacing: space before and after action
    actionText.textContent = ' ' + activity.action + ' ';
    
    var collectionName = document.createElement('span');
    collectionName.className = 'sublime-activity-context__collection-name';
    collectionName.textContent = activity.collectionName;
    
    text.appendChild(userName);
    text.appendChild(actionText);
    text.appendChild(collectionName);
    
    container.appendChild(avatar);
    container.appendChild(text);
    
    return container;
  }

  /** Truncates note text to max 2 lines - CSS handles the actual truncation, this is just for data */
  function truncateNoteText(text, maxLength) {
    if (!text) return '';
    // CSS line-clamp will handle visual truncation, but we can pre-truncate very long text
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /** Builds "X more" button with bundled avatars */
  function buildMoreButtonWithAvatars(activities, shownCount, remainingCount) {
    var moreBtn = document.createElement('div');
    moreBtn.className = 'sublime-activity-context sublime-activity-context--more-btn';
    
    // Create bundled avatars container
    var avatarsContainer = document.createElement('div');
    avatarsContainer.className = 'sublime-activity-context__avatars-bundle';
    
    // Get remaining users (skip the ones already shown)
    var remainingUsers = activities.slice(shownCount);
    var avatarsToShow = Math.min(remainingUsers.length, 4); // Max 4 avatars
    
    for (var i = 0; i < avatarsToShow; i++) {
      var avatar = document.createElement('img');
      avatar.className = 'sublime-activity-context__avatar-bundled';
      avatar.src = remainingUsers[i].avatar;
      avatar.alt = remainingUsers[i].userName;
      avatar.width = 24;
      avatar.height = 24;
      avatar.loading = 'lazy';
      avatarsContainer.appendChild(avatar);
    }
    
    var text = document.createElement('span');
    text.className = 'sublime-activity-context__more-text';
    text.textContent = remainingCount + ' more';
    
    moreBtn.appendChild(avatarsContainer);
    moreBtn.appendChild(text);
    
    return moreBtn;
  }

  /** Builds staff picks activity context (users who added card, with optional notes) */
  function buildStaffPicksActivityContext(activityData) {
    var wrapper = document.createElement('div');
    wrapper.className = 'sublime-staff-picks-activity';
    
    var activities = activityData.activities;
    var totalCount = activityData.totalCount;
    var hasMore = activityData.hasMore;
    
    // Single user, no notes
    if (totalCount === 1 && !activities[0].note) {
      var singleEl = document.createElement('div');
      singleEl.className = 'sublime-activity-context';
      
      var avatar = document.createElement('img');
      avatar.className = 'sublime-activity-context__avatar';
      avatar.src = activities[0].avatar;
      avatar.alt = activities[0].userName;
      avatar.width = 24;
      avatar.height = 24;
      avatar.loading = 'lazy';
      
      var userName = document.createElement('span');
      userName.className = 'sublime-activity-context__user-name';
      userName.textContent = activities[0].userName;
      
      singleEl.appendChild(avatar);
      singleEl.appendChild(userName);
      wrapper.appendChild(singleEl);
    }
    // Multiple users, no notes - show summary: John's avatar + name, then "and X more" with bundled avatars
    else if (!activities.some(function(a) { return a.note; })) {
      var summaryEl = document.createElement('div');
      summaryEl.className = 'sublime-activity-context';
      
      // John's avatar (single, not bundled)
      var johnAvatar = document.createElement('img');
      johnAvatar.className = 'sublime-activity-context__avatar';
      johnAvatar.src = activities[0].avatar;
      johnAvatar.alt = activities[0].userName;
      johnAvatar.width = 24;
      johnAvatar.height = 24;
      johnAvatar.loading = 'lazy';
      
      var text = document.createElement('span');
      text.className = 'sublime-activity-context__text';
      
      // John's name
      var userName = document.createElement('span');
      userName.className = 'sublime-activity-context__user-name';
      userName.textContent = activities[0].userName;
      
      // " and "
      var andMore = document.createElement('span');
      andMore.className = 'sublime-activity-context__and-more';
      andMore.textContent = ' and ';
      
      // Bundled avatars container for remaining users (excluding John)
      var avatarsContainer = document.createElement('div');
      avatarsContainer.className = 'sublime-activity-context__avatars-bundle';
      
      // Show up to 4 avatars of remaining users (excluding John)
      var remainingUsers = activities.slice(1);
      var avatarsToShow = Math.min(remainingUsers.length, 4);
      for (var i = 0; i < avatarsToShow; i++) {
        var avatar = document.createElement('img');
        avatar.className = 'sublime-activity-context__avatar-bundled';
        avatar.src = remainingUsers[i].avatar;
        avatar.alt = remainingUsers[i].userName;
        avatar.width = 24;
        avatar.height = 24;
        avatar.loading = 'lazy';
        avatarsContainer.appendChild(avatar);
      }
      
      // "X more" text
      var moreCount = document.createElement('span');
      moreCount.className = 'sublime-activity-context__more-count';
      moreCount.textContent = (totalCount - 1) + ' more';
      
      text.appendChild(userName);
      text.appendChild(andMore);
      text.appendChild(avatarsContainer);
      text.appendChild(moreCount);
      
      summaryEl.appendChild(johnAvatar);
      summaryEl.appendChild(text);
      wrapper.appendChild(summaryEl);
    }
    // Users with notes - stack them (max 2 shown)
    else {
      var notesActivities = activities.filter(function(a) { return a.note; });
      var usersWithoutNotes = activities.filter(function(a) { return !a.note; });
      var totalUsersWithNotes = notesActivities.length;
      
      // Show max 1 user with notes
      var maxShown = Math.min(totalUsersWithNotes, 1);
      for (var i = 0; i < maxShown; i++) {
        var activity = notesActivities[i];
        var noteEl = document.createElement('div');
        noteEl.className = 'sublime-activity-context sublime-activity-context--with-note';
        
        var avatar = document.createElement('img');
        avatar.className = 'sublime-activity-context__avatar';
        avatar.src = activity.avatar;
        avatar.alt = activity.userName;
        avatar.width = 24;
        avatar.height = 24;
        avatar.loading = 'lazy';
        
        var content = document.createElement('div');
        content.className = 'sublime-activity-context__content';
        
        var userName = document.createElement('div');
        userName.className = 'sublime-activity-context__user-name';
        userName.textContent = activity.userName;
        
        var note = document.createElement('div');
        note.className = 'sublime-activity-context__note';
        note.textContent = activity.note; // CSS line-clamp handles truncation
        
        content.appendChild(userName);
        content.appendChild(note);
        
        noteEl.appendChild(avatar);
        noteEl.appendChild(content);
        wrapper.appendChild(noteEl);
      }
      
      // Calculate remaining count: users with notes not shown + users without notes
      var remainingNotes = totalUsersWithNotes - maxShown;
      var remainingTotal = remainingNotes + usersWithoutNotes.length;
      
      // Add "X more" button if there are more users
      if (remainingTotal > 0) {
        var moreBtn = buildMoreButtonWithAvatars(activities, maxShown, remainingTotal);
        wrapper.appendChild(moreBtn);
      }
    }
    
    return wrapper;
  }

  /**
   * Builds library card context for All Cards feed only: one single bubble unit.
   * Collection name (bold) on first line, note (regular, slightly smaller) on second line when both present.
   * No avatars or other users. iMessage-style single rounded container.
   */
  function buildLibraryCardContext(libraryData) {
    var collections = libraryData.collections || [];
    var note = (libraryData.note || '').trim();
    var hasCollections = collections.length > 0;
    var hasNote = note.length > 0;
    if (!hasCollections && !hasNote) return null;

    var wrapper = document.createElement('div');
    wrapper.className = 'library-context';

    var bubble = document.createElement('div');
    bubble.className = 'library-context__bubble';

    if (hasCollections) {
      var collectionLine = document.createElement('div');
      collectionLine.className = 'library-context__collection-line';
      if (collections.length === 1) {
        var singleName = document.createElement('span');
        singleName.className = 'library-context__collection-name';
        singleName.textContent = collections[0];
        collectionLine.appendChild(singleName);
      } else {
        var firstPart = document.createElement('span');
        firstPart.className = 'library-context__collection-name';
        firstPart.textContent = collections[0];
        var andSpan = document.createElement('span');
        andSpan.className = 'library-context__and';
        andSpan.textContent = ' and ';
        var otherCountSpan = document.createElement('span');
        otherCountSpan.className = 'library-context__other-count';
        otherCountSpan.textContent = (collections.length - 1) + ' other collection' + (collections.length === 2 ? '' : 's');
        collectionLine.appendChild(firstPart);
        collectionLine.appendChild(andSpan);
        collectionLine.appendChild(otherCountSpan);
      }
      bubble.appendChild(collectionLine);
    }

    if (hasNote) {
      var noteLine = document.createElement('div');
      noteLine.className = 'library-context__note';
      noteLine.textContent = note;
      bubble.appendChild(noteLine);
    }

    wrapper.appendChild(bubble);
    return wrapper;
  }

  /** Generate mock library context for a card in All Cards feed (collections + optional note). */
  function generateLibraryContextForCard(cardItem, index) {
    var pool = LIBRARY_COLLECTION_NAMES;
    var notes = LIBRARY_NOTES;
    var note = notes[index % notes.length];
    var variant = index % 5;
    var collections = [];
    if (variant === 0) {
      collections = [pool[index % pool.length]];
    } else if (variant === 1) {
      collections = [];
    } else if (variant === 2 || variant === 3) {
      var first = pool[index % pool.length];
      var second = pool[(index + 3) % pool.length];
      var third = pool[(index + 7) % pool.length];
      collections = [first, second, third];
    } else {
      collections = [pool[(index + 1) % pool.length]];
    }
    if (variant === 1 && !note) note = 'Saved for later';
    return { collections: collections, note: note };
  }

  /** Wraps any feed card in a shell with actions row above the card (More, Share, Insights, Go to, Save). Hover on shell keeps actions visible. */
  function wrapCardWithShell(cardEl, activityContext) {
    var shell = document.createElement('div');
    shell.className = 'sublime-card-shell';
    var actionsRow = document.createElement('div');
    actionsRow.className = 'sublime-card-shell__actions-row';
    actionsRow.setAttribute('aria-hidden', 'true');
    var actions = document.createElement('div');
    actions.className = 'sublime-card-shell__actions';
    actions.setAttribute('aria-label', 'Card actions');
    var left = document.createElement('div');
    left.className = 'sublime-card-shell__actions-left';
    /* 1. More menu */
    var moreBtn = document.createElement('button');
    moreBtn.type = 'button';
    moreBtn.className = 'sublime-card-shell__action sublime-card-shell__action--more';
    moreBtn.setAttribute('aria-label', 'More actions');
    moreBtn.setAttribute('aria-haspopup', 'true');
    var moreImg = document.createElement('img');
    moreImg.src = '../assets/MORE-MENU.svg';
    moreImg.alt = '';
    moreImg.width = 25;
    moreImg.height = 25;
    moreBtn.appendChild(moreImg);
    /* 2. Share */
    var shareBtn = document.createElement('button');
    shareBtn.type = 'button';
    shareBtn.className = 'sublime-card-shell__action sublime-card-shell__action--share';
    shareBtn.setAttribute('aria-label', 'Share');
    var shareImg = document.createElement('img');
    shareImg.src = '../assets/SHARE.svg';
    shareImg.alt = '';
    shareImg.width = 25;
    shareImg.height = 25;
    shareBtn.appendChild(shareImg);
    /* 3. Insights */
    var insightsBtn = document.createElement('button');
    insightsBtn.type = 'button';
    insightsBtn.className = 'sublime-card-shell__action sublime-card-shell__action--insights';
    insightsBtn.setAttribute('aria-label', 'Insights');
    var insightsImg = document.createElement('img');
    insightsImg.src = '../assets/insights.svg';
    insightsImg.alt = '';
    insightsImg.width = 25;
    insightsImg.height = 25;
    insightsBtn.appendChild(insightsImg);
    /* 4. Go to */
    var goToBtn = document.createElement('button');
    goToBtn.type = 'button';
    goToBtn.className = 'sublime-card-shell__action sublime-card-shell__action--go-to';
    goToBtn.setAttribute('aria-label', 'Go to');
    var goToImg = document.createElement('img');
    goToImg.src = '../assets/go-to.svg';
    goToImg.alt = '';
    goToImg.width = 25;
    goToImg.height = 25;
    goToBtn.appendChild(goToImg);
    left.appendChild(moreBtn);
    left.appendChild(shareBtn);
    left.appendChild(insightsBtn);
    left.appendChild(goToBtn);
    /* 5. Save (right side) */
    var right = document.createElement('div');
    right.className = 'sublime-card-shell__actions-right';
    var saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'sublime-card-shell__action sublime-card-shell__action--save';
    saveBtn.setAttribute('aria-label', 'Save to library');
    var saveText = document.createElement('span');
    saveText.className = 'sublime-card-shell__save-text';
    saveText.textContent = 'Save';
    var savePlus = document.createElement('span');
    savePlus.className = 'sublime-card-shell__save-plus';
    savePlus.setAttribute('aria-hidden', 'true');
    var savePlusImg = document.createElement('img');
    savePlusImg.src = '../assets/ADD.svg';
    savePlusImg.alt = '';
    savePlusImg.width = 21.43;
    savePlusImg.height = 21.43;
    savePlusImg.className = 'sublime-card-shell__save-plus-icon';
    savePlus.appendChild(savePlusImg);
    saveBtn.appendChild(saveText);
    saveBtn.appendChild(savePlus);
    right.appendChild(saveBtn);
    actions.appendChild(left);
    actions.appendChild(right);
    actionsRow.appendChild(actions);
    shell.appendChild(actionsRow);
    shell.appendChild(cardEl);
    if (activityContext) {
      shell.appendChild(activityContext);
    }
    moreBtn.addEventListener('click', function (e) { e.stopPropagation(); });
    shareBtn.addEventListener('click', function (e) { e.stopPropagation(); });
    insightsBtn.addEventListener('click', function (e) { e.stopPropagation(); });
    goToBtn.addEventListener('click', function (e) { e.stopPropagation(); });
    saveBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (saveBtn.classList.contains('is-saved')) return;
      openSaveFromCardModal(saveBtn, saveText, savePlusImg);
    });
    return shell;
  }

  function openSaveFromCardModal(saveBtnEl, saveTextEl, savePlusImgEl) {
    if (!saveFromCardOverlay || !saveFromCardModal) return;
    var shell = saveBtnEl.closest('.sublime-card-shell');
    if (shell) shell.classList.add('sublime-card-shell--save-open');
    pendingSaveCard = { saveBtn: saveBtnEl, saveText: saveTextEl, savePlusImg: savePlusImgEl, shell: shell };
    saveFromCardOverlay.classList.add('is-visible');
    saveFromCardOverlay.setAttribute('aria-hidden', 'false');
    function positionModal() {
      var saveRect = saveBtnEl.getBoundingClientRect();
      var shellRect = shell ? shell.getBoundingClientRect() : saveRect;
      var modalW = saveFromCardModal.offsetWidth || 364;
      var modalH = saveFromCardModal.offsetHeight || 320;
      var gap = 8;
      var padding = 12;
      /* Below the Save CTA, right-aligned with the card */
      var top = saveRect.bottom + gap;
      var left = shellRect.right - modalW;
      if (left < padding) left = padding;
      if (left + modalW > window.innerWidth - padding) left = window.innerWidth - modalW - padding;
      if (top + modalH > window.innerHeight - padding) top = window.innerHeight - modalH - padding;
      if (top < padding) top = padding;
      saveFromCardModal.style.top = top + 'px';
      saveFromCardModal.style.left = left + 'px';
    }
    positionModal();
    requestAnimationFrame(positionModal);
  }

  function closeSaveFromCardModal() {
    if (!saveFromCardOverlay) return;
    if (pendingSaveCard && pendingSaveCard.shell) pendingSaveCard.shell.classList.remove('sublime-card-shell--save-open');
    saveFromCardOverlay.classList.remove('is-visible');
    saveFromCardOverlay.setAttribute('aria-hidden', 'true');
    pendingSaveCard = null;
  }

  function applySavedStateToCard() {
    if (!pendingSaveCard) return;
    var saveBtn = pendingSaveCard.saveBtn;
    var saveText = pendingSaveCard.saveText;
    var savePlusImg = pendingSaveCard.savePlusImg;
    saveBtn.classList.add('is-saved');
    saveBtn.setAttribute('aria-label', 'Saved to library');
    saveText.textContent = 'Saved';
    savePlusImg.src = '../assets/check.svg';
    pendingSaveCard = null;
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
    var cards = activeSublimeCategory === 'staff-picks' ? shuffleArray(staffPicksFeedCards) : (activeSublimeCategory === 'following' ? shuffleArray(followingFeedCards) : []);
    var isFollowing = activeSublimeCategory === 'following';
    var isStaffPicks = activeSublimeCategory === 'staff-picks';
    for (var i = 0; i < cards.length; i++) {
      var card = buildCard(cards[i]);
      if (!card) continue;
      var activityContext = null;
      if (isFollowing) {
        var activity = generateActivityForCard(cards[i], i);
        activityContext = buildActivityContext(activity);
      }
      // Staff picks: no activity context (removed notes/avatars)
      var shell = wrapCardWithShell(card, activityContext);
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

  // --- Collections directory (My Library > Collections) ---
  var collectionsDirectoryList = document.getElementById('collections-directory-list');
  var collectionsDirectoryBackBtn = document.getElementById('collections-directory-back-btn');
  var collectionsDirectoryTopBar = document.getElementById('collections-directory-top-bar');
  var collectionsDirectoryTitleMini = document.getElementById('collections-directory-title-mini');
  var collectionsDirectoryHeaderEl = document.getElementById('collections-directory-header');
  var collectionsDirectoryContent = document.getElementById('collections-directory-content');
  var collectionsDirectoryMiniObserver = null;
  var collectionsDirectoryMiniRafId = null;
  var collectionsDirectorySearchTopBarInner = document.querySelector('#collections-directory-top-bar .collection-top-bar-inner');
  var collectionsDirectorySearchTriggerBtn = document.getElementById('collections-directory-search-trigger-btn');
  var collectionsDirectorySearchWrap = document.getElementById('collections-directory-search-wrap');
  var collectionsDirectorySearchInput = document.getElementById('collections-directory-search-input');
  var collectionsDirectorySearchClear = document.getElementById('collections-directory-search-clear');
  var COLLECTIONS_DIRECTORY_SEARCH_TRANSITION_MS = 420;

  var COLLECTIONS_DIRECTORY_MINI_MAX_HEIGHT = 115;
  var collectionsDirectoryMiniWidths = [80, 96, 86, 92, 88];
  var collectionsDirectoryTextMiniSizes = [[78, 100], [72, 96], [86, 105]];

  /** Build a single mini preview for a card: image/file/video → img/video; text/highlight → text snippet. Sizing is set by setCollectionsDirectoryMiniSize. */
  function buildMiniPreview(cardItem) {
    var mini = document.createElement('div');
    mini.className = 'collections-directory-mini';
    mini.setAttribute('data-mini-type', cardItem.type || 'text');
    if (cardItem.type === 'image' && cardItem.src) {
      var img = document.createElement('img');
      img.src = cardItem.src;
      img.alt = '';
      img.loading = 'lazy';
      mini.appendChild(img);
    } else if (cardItem.type === 'file' && (cardItem.previewSrc || cardItem.src)) {
      var fileImg = document.createElement('img');
      fileImg.src = cardItem.previewSrc || cardItem.src;
      fileImg.alt = '';
      fileImg.loading = 'lazy';
      mini.appendChild(fileImg);
    } else if (cardItem.type === 'video' && cardItem.videoSrc) {
      var vid = document.createElement('video');
      vid.src = cardItem.videoSrc;
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.autoplay = true;
      vid.className = 'collections-directory-mini-video';
      mini.appendChild(vid);
    } else {
      mini.classList.add('collections-directory-mini--text');
      var text = (cardItem.body || '').trim();
      if (text.length > 80) text = text.substring(0, 80) + '…';
      mini.textContent = text || 'Note';
    }
    return mini;
  }

  function setCollectionsDirectoryMiniSize(mini, cardItem, index) {
    var type = cardItem.type || 'text';
    var maxH = COLLECTIONS_DIRECTORY_MINI_MAX_HEIGHT;
    if (type === 'image' || type === 'file') {
      var w = collectionsDirectoryMiniWidths[index % collectionsDirectoryMiniWidths.length];
      mini.style.width = w + 'px';
      mini.style.height = maxH + 'px';
      var img = mini.querySelector('img');
      if (img) {
        function sizeFromImage() {
          var nw = img.naturalWidth;
          var nh = img.naturalHeight;
          if (!nw || !nh) return;
          var cardW = parseFloat(mini.style.width, 10);
          var cardH = Math.min(cardW * (nh / nw), maxH);
          mini.style.height = cardH + 'px';
        }
        img.addEventListener('error', function () { mini.style.visibility = 'hidden'; });
        if (img.complete) sizeFromImage();
        else img.addEventListener('load', sizeFromImage);
      }
    } else if (type === 'video') {
      var vw = collectionsDirectoryMiniWidths[index % collectionsDirectoryMiniWidths.length];
      mini.style.width = vw + 'px';
      mini.style.height = maxH + 'px';
      var video = mini.querySelector('video');
      if (video) {
        function sizeFromVideo() {
          var vWidth = video.videoWidth;
          var vHeight = video.videoHeight;
          if (!vWidth || !vHeight) return;
          var cardW = parseFloat(mini.style.width, 10);
          var cardH = Math.min(cardW * (vHeight / vWidth), maxH);
          mini.style.height = cardH + 'px';
        }
        if (video.readyState >= 1) sizeFromVideo();
        else video.addEventListener('loadedmetadata', sizeFromVideo);
      }
    } else {
      var ts = collectionsDirectoryTextMiniSizes[index % collectionsDirectoryTextMiniSizes.length];
      mini.style.width = ts[0] + 'px';
      mini.style.height = ts[1] + 'px';
    }
  }

  function renderCollectionsDirectory() {
    if (!collectionsDirectoryList) return;
    collectionsDirectoryList.textContent = '';
    var cardPool = staffPicksFeedCards.slice();
    COLLECTIONS_DIRECTORY_DATA.forEach(function (coll) {
      var li = document.createElement('li');
      li.className = 'collections-directory-item';
      li.setAttribute('role', 'listitem');
      li.setAttribute('data-collection-name', coll.name);
      li.setAttribute('data-collection-count', String(coll.count));
      li.setAttribute('data-collection-icon', coll.icon || 'PUBLIC');

      var left = document.createElement('div');
      left.className = 'collections-directory-item__left';
      var iconWrap = document.createElement('span');
      iconWrap.className = 'collections-directory-item__icon-wrap';
      var icon = document.createElement('img');
      icon.className = 'collections-directory-item__icon';
      icon.src = '../assets/' + (coll.icon || 'PUBLIC') + '.svg';
      icon.alt = '';
      icon.width = 35;
      icon.height = 35;
      iconWrap.appendChild(icon);
      var title = document.createElement('span');
      title.className = 'collections-directory-item__title';
      title.textContent = coll.name;
      var description = document.createElement('span');
      description.className = 'collections-directory-item__description';
      description.textContent = coll.description || '';
      var owner = document.createElement('span');
      owner.className = 'collections-directory-item__owner';
      owner.textContent = coll.owner;
      left.appendChild(iconWrap);
      left.appendChild(title);
      left.appendChild(description);
      left.appendChild(owner);
      li.appendChild(left);

      var right = document.createElement('div');
      right.className = 'collections-directory-item__right';
      var minis = document.createElement('div');
      minis.className = 'collections-directory-minis';
      var shuffled = shuffleArray(cardPool);
      for (var i = 0; i < 3; i++) {
        var cardItem = shuffled[i % shuffled.length];
        var mini = buildMiniPreview(cardItem);
        setCollectionsDirectoryMiniSize(mini, cardItem, i);
        minis.appendChild(mini);
      }
      var countRow = document.createElement('div');
      countRow.className = 'collections-directory-item__count-row';
      var count = document.createElement('span');
      count.className = 'collections-directory-item__count';
      count.textContent = String(coll.count);
      var chevron = document.createElement('img');
      chevron.className = 'collections-directory-item__chevron';
      chevron.src = '../assets/chevron.svg';
      chevron.alt = '';
      chevron.width = 35;
      chevron.height = 35;
      countRow.appendChild(count);
      countRow.appendChild(chevron);
      right.appendChild(minis);
      right.appendChild(countRow);
      li.appendChild(right);

      li.addEventListener('click', function (e) {
        e.preventDefault();
        var name = this.getAttribute('data-collection-name');
        var countStr = this.getAttribute('data-collection-count');
        var icon = this.getAttribute('data-collection-icon') || undefined;
        collectionOpenedFromCollectionsDirectory = true;
        closeCollectionsDirectory();
        openCollection(name || 'Collection', countStr || '0', icon);
      });
      collectionsDirectoryList.appendChild(li);
    });
  }

  function setCollectionsDirectoryMiniVisible(show) {
    if (!collectionsDirectoryTopBar) return;
    collectionsDirectoryTopBar.classList.toggle('collection-top-bar--mini', show);
  }

  function checkCollectionsDirectoryMiniFromScroll() {
    if (!collectionsDirectoryHeaderEl || !collectionsDirectoryTopBar || !collectionsDirectoryView || !collectionsDirectoryView.classList.contains('collections-directory-view--visible')) return;
    var rect = collectionsDirectoryHeaderEl.getBoundingClientRect();
    var topBarHeight = collectionsDirectoryTopBar.offsetHeight || 76;
    var showMini = rect.bottom < topBarHeight;
    setCollectionsDirectoryMiniVisible(showMini);
  }

  function collectionsDirectoryMiniRafLoop() {
    if (!collectionsDirectoryView || !collectionsDirectoryView.classList.contains('collections-directory-view--visible')) {
      collectionsDirectoryMiniRafId = null;
      return;
    }
    checkCollectionsDirectoryMiniFromScroll();
    collectionsDirectoryMiniRafId = requestAnimationFrame(collectionsDirectoryMiniRafLoop);
  }

  function startCollectionsDirectoryMiniObserver() {
    stopCollectionsDirectoryMiniObserver();
    if (!collectionsDirectoryTopBar || !collectionsDirectoryHeaderEl) return;
    var runObserver = function () {
      if (!collectionsDirectoryView || !collectionsDirectoryView.classList.contains('collections-directory-view--visible')) return;
      collectionsDirectoryMiniObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            setCollectionsDirectoryMiniVisible(!entry.isIntersecting);
          });
        },
        { root: null, rootMargin: '0px', threshold: 0 }
      );
      collectionsDirectoryMiniObserver.observe(collectionsDirectoryHeaderEl);
    };
    requestAnimationFrame(function () { requestAnimationFrame(runObserver); });
    if (collectionsDirectoryContent) {
      collectionsDirectoryContent.addEventListener('scroll', checkCollectionsDirectoryMiniFromScroll, { passive: true });
      collectionsDirectoryContent.addEventListener('touchmove', checkCollectionsDirectoryMiniFromScroll, { passive: true });
    }
    window.addEventListener('scroll', checkCollectionsDirectoryMiniFromScroll, { passive: true });
    document.addEventListener('scroll', checkCollectionsDirectoryMiniFromScroll, { passive: true });
    if (collectionsDirectoryMiniRafId !== null) cancelAnimationFrame(collectionsDirectoryMiniRafId);
    collectionsDirectoryMiniRafId = requestAnimationFrame(collectionsDirectoryMiniRafLoop);
  }

  function stopCollectionsDirectoryMiniObserver() {
    if (collectionsDirectoryMiniObserver) {
      collectionsDirectoryMiniObserver.disconnect();
      collectionsDirectoryMiniObserver = null;
    }
    if (collectionsDirectoryMiniRafId !== null) {
      cancelAnimationFrame(collectionsDirectoryMiniRafId);
      collectionsDirectoryMiniRafId = null;
    }
    if (collectionsDirectoryContent) {
      collectionsDirectoryContent.removeEventListener('scroll', checkCollectionsDirectoryMiniFromScroll);
      collectionsDirectoryContent.removeEventListener('touchmove', checkCollectionsDirectoryMiniFromScroll);
    }
    window.removeEventListener('scroll', checkCollectionsDirectoryMiniFromScroll);
    document.removeEventListener('scroll', checkCollectionsDirectoryMiniFromScroll);
  }

  function collapseCollectionsDirectorySearch(focusTriggerAfterCollapse) {
    if (collectionsDirectorySearchTopBarInner) collectionsDirectorySearchTopBarInner.classList.remove('all-cards-search-expanded');
    if (collectionsDirectorySearchInput) collectionsDirectorySearchInput.value = '';
    if (focusTriggerAfterCollapse && collectionsDirectorySearchTriggerBtn) {
      setTimeout(function () { collectionsDirectorySearchTriggerBtn.focus(); }, COLLECTIONS_DIRECTORY_SEARCH_TRANSITION_MS);
    }
  }

  function openCollectionsDirectory() {
    if (!collectionsDirectoryView || !libraryView) return;
    libraryView.classList.remove('library-view--visible');
    libraryView.setAttribute('aria-hidden', 'true');
    collectionsDirectoryView.classList.add('collections-directory-view--visible');
    collectionsDirectoryView.setAttribute('aria-hidden', 'false');
    renderCollectionsDirectory();
    if (collectionsDirectoryTopBar) collectionsDirectoryTopBar.classList.remove('collection-top-bar--mini');
    if (collectionsDirectoryContent) collectionsDirectoryContent.scrollTop = 0;
    setTimeout(startCollectionsDirectoryMiniObserver, 100);
  }

  function closeCollectionsDirectory() {
    if (!collectionsDirectoryView || !libraryView) return;
    stopCollectionsDirectoryMiniObserver();
    collapseCollectionsDirectorySearch();
    collectionsDirectoryView.classList.remove('collections-directory-view--visible');
    collectionsDirectoryView.setAttribute('aria-hidden', 'true');
    libraryView.classList.add('library-view--visible');
    libraryView.setAttribute('aria-hidden', 'false');
  }

  if (collectionsDirectoryBackBtn) {
    collectionsDirectoryBackBtn.addEventListener('click', function () {
      closeCollectionsDirectory();
    });
  }

  if (collectionsDirectorySearchTriggerBtn && collectionsDirectorySearchTopBarInner && collectionsDirectorySearchInput) {
    collectionsDirectorySearchTriggerBtn.addEventListener('click', function () {
      collectionsDirectorySearchTopBarInner.classList.add('all-cards-search-expanded');
      setTimeout(function () { collectionsDirectorySearchInput.focus(); }, 0);
    });
  }
  if (collectionsDirectorySearchInput) {
    collectionsDirectorySearchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        collapseCollectionsDirectorySearch(true);
      }
    });
  }
  if (collectionsDirectorySearchClear && collectionsDirectorySearchInput) {
    collectionsDirectorySearchClear.addEventListener('click', function () {
      collapseCollectionsDirectorySearch(true);
    });
  }

  document.querySelectorAll('.library-filter-btn[data-filter="collections"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openCollectionsDirectory();
    });
  });

  // --- Collection landing page ---
  var collectionOpenedFromCollectionsDirectory = false;
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
  var collectionHeaderIcon = document.getElementById('collection-header-icon');
  var collectionMiniObserver = null;
  var collectionMiniRafId = null;

  // Landing page standalone icons (PUBLIC shows no icon)
  var COLLECTION_LANDING_ICON = {
    PUBLIC: null,
    PRIVATE: 'PRIVATE-LANDING',
    'PUBLIC-COLLAB': 'PUBLIC-SHARED',
    'PRIVATE-COLLAB': 'PRIVATE-SHARED',
    COMMUNAL: 'COMMUNAL-LANDING'
  };

  function renderCollectionFeed(name, count) {
    var title = name || 'Collection';
    var countStr = count != null ? String(count) : '0';
    if (collectionTitleMini) collectionTitleMini.textContent = title;
    if (collectionHeaderTitle) collectionHeaderTitle.textContent = title;
    if (collectionHeaderCount) collectionHeaderCount.textContent = countStr;
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

  function openCollection(name, count, icon) {
    if (!collectionView || !libraryView) return;
    if (icon == null) {
      var found = COLLECTIONS_DIRECTORY_DATA.filter(function (c) { return c.name === name; })[0];
      icon = found && found.icon ? found.icon : 'PUBLIC';
    }
    libraryView.classList.remove('library-view--visible');
    libraryView.setAttribute('aria-hidden', 'true');
    collectionView.classList.add('collection-view--visible');
    collectionView.setAttribute('aria-hidden', 'false');
    renderCollectionFeed(name, count);
    if (collectionHeaderIcon) {
      var landingAsset = COLLECTION_LANDING_ICON[icon];
      if (landingAsset) {
        collectionHeaderIcon.src = '../assets/' + landingAsset + '.svg';
        collectionHeaderIcon.style.display = '';
      } else {
        collectionHeaderIcon.src = '';
        collectionHeaderIcon.style.display = 'none';
      }
    }
    if (collectionTopBar) collectionTopBar.classList.remove('collection-top-bar--mini');
    if (collectionContent) collectionContent.scrollTop = 0;
    setTimeout(startCollectionMiniObserver, 100);
  }

  function closeCollection() {
    if (!collectionView || !libraryView) return;
    stopCollectionMiniObserver();
    if (typeof collapseCollectionSearch === 'function') collapseCollectionSearch();
    collectionView.classList.remove('collection-view--visible');
    collectionView.setAttribute('aria-hidden', 'true');
    if (collectionOpenedFromCollectionsDirectory) {
      collectionOpenedFromCollectionsDirectory = false;
      openCollectionsDirectory();
    } else {
      libraryView.classList.add('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'false');
    }
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
      var icon = link.getAttribute('data-icon') || undefined;
      collectionOpenedFromCollectionsDirectory = false;
      openCollection(name, count, icon);
    });
  });

  // --- Pinned collections: drag-and-drop reorder + more menu (Unpin) ---
  var libraryPinnedList = document.getElementById('library-pinned-list');
  if (libraryPinnedList) {
    var pinnedRows = libraryPinnedList.querySelectorAll('.library-pinned-row');
    pinnedRows.forEach(function (row) {
      row.setAttribute('draggable', 'true');
    });

    libraryPinnedList.addEventListener('dragstart', function (e) {
      var row = e.target.closest('.library-pinned-row');
      if (!row || !e.target.closest('.library-pinned-drag')) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', row.getAttribute('data-pinned-index') || Array.prototype.indexOf.call(libraryPinnedList.children, row));
      row.classList.add('library-pinned-row--dragging');
    });

    libraryPinnedList.addEventListener('dragend', function (e) {
      var row = e.target.closest('.library-pinned-row');
      if (row) row.classList.remove('library-pinned-row--dragging');
      clearDropIndicator();
    });

    function clearDropIndicator() {
      libraryPinnedList.querySelectorAll('.library-pinned-row--drop-before, .library-pinned-row--drop-after').forEach(function (el) {
        el.classList.remove('library-pinned-row--drop-before', 'library-pinned-row--drop-after');
      });
    }

    libraryPinnedList.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      var dragging = libraryPinnedList.querySelector('.library-pinned-row--dragging');
      if (!dragging) return;
      var row = e.target.closest('.library-pinned-row');
      clearDropIndicator();
      if (!row || row === dragging) return;
      var rect = row.getBoundingClientRect();
      var after = rect.top + rect.height / 2 < e.clientY;
      row.classList.add(after ? 'library-pinned-row--drop-after' : 'library-pinned-row--drop-before');
    });

    libraryPinnedList.addEventListener('dragleave', function (e) {
      if (!libraryPinnedList.contains(e.relatedTarget)) clearDropIndicator();
    });

    libraryPinnedList.addEventListener('drop', function (e) {
      e.preventDefault();
      clearDropIndicator();
      var dragging = libraryPinnedList.querySelector('.library-pinned-row--dragging');
      if (!dragging) return;
      var row = e.target.closest('.library-pinned-row');
      if (!row || row === dragging) return;
      var after = row.getBoundingClientRect().top + row.getBoundingClientRect().height / 2 < e.clientY;
      var all = Array.prototype.slice.call(libraryPinnedList.querySelectorAll('.library-pinned-row'));
      var from = all.indexOf(dragging);
      var to = all.indexOf(row) + (after ? 1 : 0);
      if (from === to || from === to - 1) return;
      if (from < to) to--;
      libraryPinnedList.insertBefore(dragging, libraryPinnedList.children[to] || null);
    });

    // More menu: Unpin
    libraryPinnedList.querySelectorAll('.library-pinned-more').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var row = btn.closest('.library-pinned-row');
        if (!row) return;
        var menu = document.getElementById('library-pinned-more-menu');
        if (menu) {
          menu.remove();
        }
        var rect = btn.getBoundingClientRect();
        menu = document.createElement('div');
        menu.id = 'library-pinned-more-menu';
        menu.className = 'library-pinned-more-menu';
        menu.innerHTML = '<button type="button" class="library-pinned-more-menu__item" data-action="unpin">Unpin collection</button>';
        document.body.appendChild(menu);
        menu.style.left = rect.right - 120 + 'px';
        menu.style.top = rect.bottom + 4 + 'px';
        menu.addEventListener('click', function (ev) { ev.stopPropagation(); });

        function closeMenu() {
          if (menu && menu.parentNode) menu.parentNode.removeChild(menu);
          document.removeEventListener('click', closeMenu);
        }

        menu.querySelector('[data-action="unpin"]').addEventListener('click', function () {
          row.remove();
          closeMenu();
        });
        setTimeout(function () {
          document.addEventListener('click', closeMenu);
        }, 0);
      });
    });
  }

  if (collectionBackBtn) {
    collectionBackBtn.addEventListener('click', closeCollection);
  }

  // Collection landing: expandable search (same as All Cards — slide left, 10px from back; X and Escape collapse)
  var collectionSearchTopBarInner = document.querySelector('#collection-top-bar .collection-top-bar-inner');
  var collectionSearchTriggerBtn = document.getElementById('collection-search-trigger-btn');
  var collectionSearchWrap = document.getElementById('collection-search-wrap');
  var collectionSearchInput = document.getElementById('collection-search-input');
  var collectionSearchClear = document.getElementById('collection-search-clear');
  var COLLECTION_SEARCH_TRANSITION_MS = 420;

  if (collectionSearchTriggerBtn && collectionSearchTopBarInner && collectionSearchInput) {
    collectionSearchTriggerBtn.addEventListener('click', function () {
      collectionSearchTopBarInner.classList.add('collection-search-expanded');
      setTimeout(function () { collectionSearchInput.focus(); }, 0);
    });
  }

  if (collectionSearchInput) {
    collectionSearchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        collapseCollectionSearch(true);
      }
    });
  }

  if (collectionSearchClear && collectionSearchInput) {
    collectionSearchClear.addEventListener('click', function () {
      collapseCollectionSearch(true);
    });
  }

  function collapseCollectionSearch(focusTriggerAfterCollapse) {
    if (collectionSearchTopBarInner) collectionSearchTopBarInner.classList.remove('collection-search-expanded');
    if (collectionSearchInput) collectionSearchInput.value = '';
    if (focusTriggerAfterCollapse && collectionSearchTriggerBtn) {
      setTimeout(function () { collectionSearchTriggerBtn.focus(); }, COLLECTION_SEARCH_TRANSITION_MS);
    }
  }

  // --- All cards page (from My Library > All cards) ---
  var allCardsBackBtn = document.getElementById('all-cards-back-btn');
  var allCardsContent = document.getElementById('all-cards-content');
  var allCardsTopBar = document.getElementById('all-cards-top-bar');
  var allCardsTitleMini = document.getElementById('all-cards-title-mini');
  var allCardsHeaderEl = document.getElementById('all-cards-header');
  var allCardsFeedCol1 = document.getElementById('all-cards-feed-col-1');
  var allCardsFeedCol2 = document.getElementById('all-cards-feed-col-2');
  var allCardsMiniObserver = null;
  var allCardsMiniRafId = null;

  function renderAllCardsFeed() {
    if (allCardsTitleMini) allCardsTitleMini.textContent = 'All cards';
    if (!allCardsFeedCol1 || !allCardsFeedCol2) return;
    allCardsFeedCol1.textContent = '';
    allCardsFeedCol2.textContent = '';
    var cards = shuffleArray(staffPicksFeedCards);
    for (var i = 0; i < cards.length; i++) {
      var card = buildCard(cards[i]);
      if (!card) continue;
      var libraryData = generateLibraryContextForCard(cards[i], i);
      var libraryContext = buildLibraryCardContext(libraryData);
      var shell = wrapCardWithShell(card, libraryContext);
      (i % 2 === 0 ? allCardsFeedCol1 : allCardsFeedCol2).appendChild(shell);
    }
    requestAnimationFrame(function () {
      if (allCardsView) allCardsView.querySelectorAll('.sublime-card--text, .sublime-card--highlight').forEach(hideExpandIfNotTruncated);
    });
  }

  function openAllCards() {
    if (!allCardsView || !libraryView) return;
    libraryView.classList.remove('library-view--visible');
    libraryView.setAttribute('aria-hidden', 'true');
    allCardsView.classList.add('all-cards-view--visible');
    allCardsView.setAttribute('aria-hidden', 'false');
    renderAllCardsFeed();
    if (allCardsTopBar) allCardsTopBar.classList.remove('collection-top-bar--mini');
    if (allCardsContent) allCardsContent.scrollTop = 0;
    if (addWrap && addWrap.classList.contains('is-expanded')) addWrap.classList.add('add-menu--on-collection');
    setTimeout(startAllCardsMiniObserver, 100);
  }

  function closeAllCards() {
    if (!allCardsView || !libraryView) return;
    stopAllCardsMiniObserver();
    collapseAllCardsSearch();
    allCardsView.classList.remove('all-cards-view--visible');
    allCardsView.setAttribute('aria-hidden', 'true');
    libraryView.classList.add('library-view--visible');
    libraryView.setAttribute('aria-hidden', 'false');
    if (addWrap) addWrap.classList.remove('add-menu--on-collection');
  }

  function setAllCardsMiniVisible(show) {
    if (!allCardsTopBar) return;
    allCardsTopBar.classList.toggle('collection-top-bar--mini', show);
  }

  function checkAllCardsMiniFromScroll() {
    if (!allCardsHeaderEl || !allCardsTopBar || !allCardsView || !allCardsView.classList.contains('all-cards-view--visible')) return;
    var rect = allCardsHeaderEl.getBoundingClientRect();
    var topBarHeight = allCardsTopBar.offsetHeight || 76;
    var showMini = rect.bottom < topBarHeight;
    setAllCardsMiniVisible(showMini);
  }

  function allCardsMiniRafLoop() {
    if (!allCardsView || !allCardsView.classList.contains('all-cards-view--visible')) {
      allCardsMiniRafId = null;
      return;
    }
    checkAllCardsMiniFromScroll();
    allCardsMiniRafId = requestAnimationFrame(allCardsMiniRafLoop);
  }

  function startAllCardsMiniObserver() {
    stopAllCardsMiniObserver();
    if (!allCardsTopBar || !allCardsHeaderEl) return;
    var runObserver = function () {
      if (!allCardsView || !allCardsView.classList.contains('all-cards-view--visible')) return;
      allCardsMiniObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            setAllCardsMiniVisible(!entry.isIntersecting);
          });
        },
        { root: null, rootMargin: '0px', threshold: 0 }
      );
      allCardsMiniObserver.observe(allCardsHeaderEl);
    };
    requestAnimationFrame(function () { requestAnimationFrame(runObserver); });
    if (allCardsContent) {
      allCardsContent.addEventListener('scroll', checkAllCardsMiniFromScroll, { passive: true });
      allCardsContent.addEventListener('touchmove', checkAllCardsMiniFromScroll, { passive: true });
    }
    window.addEventListener('scroll', checkAllCardsMiniFromScroll, { passive: true });
    document.addEventListener('scroll', checkAllCardsMiniFromScroll, { passive: true });
    if (allCardsMiniRafId !== null) cancelAnimationFrame(allCardsMiniRafId);
    allCardsMiniRafId = requestAnimationFrame(allCardsMiniRafLoop);
  }

  function stopAllCardsMiniObserver() {
    if (allCardsMiniObserver) {
      allCardsMiniObserver.disconnect();
      allCardsMiniObserver = null;
    }
    if (allCardsMiniRafId !== null) {
      cancelAnimationFrame(allCardsMiniRafId);
      allCardsMiniRafId = null;
    }
    if (allCardsContent) {
      allCardsContent.removeEventListener('scroll', checkAllCardsMiniFromScroll);
      allCardsContent.removeEventListener('touchmove', checkAllCardsMiniFromScroll);
    }
    window.removeEventListener('scroll', checkAllCardsMiniFromScroll);
    document.removeEventListener('scroll', checkAllCardsMiniFromScroll);
  }

  document.querySelectorAll('.library-filter-btn[data-filter="all-cards"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      openAllCards();
    });
  });

  if (allCardsBackBtn) {
    allCardsBackBtn.addEventListener('click', closeAllCards);
  }

  var allCardsFeed = document.querySelector('#all-cards-view .collection-feed');
  if (allCardsFeed) allCardsFeed.addEventListener('click', onSublimeFeedClick);

  // All cards: expandable search — click Search icon to slide search bar left (10px from back), focus input
  var allCardsTopBarInner = document.querySelector('#all-cards-top-bar .collection-top-bar-inner');
  var allCardsSearchTriggerBtn = document.getElementById('all-cards-search-trigger-btn');
  var allCardsSearchWrap = document.getElementById('all-cards-search-wrap');
  var allCardsSearchInput = document.getElementById('all-cards-search-input');
  var allCardsSearchClear = document.getElementById('all-cards-search-clear');

  function updateAllCardsSearchState() {
    var hasValue = allCardsSearchInput && allCardsSearchInput.value.trim().length > 0;
    if (allCardsSearchWrap) allCardsSearchWrap.classList.toggle('has-value', hasValue);
  }

  if (allCardsSearchTriggerBtn && allCardsTopBarInner && allCardsSearchInput) {
    allCardsSearchTriggerBtn.addEventListener('click', function () {
      allCardsTopBarInner.classList.add('all-cards-search-expanded');
      setTimeout(function () { allCardsSearchInput.focus(); }, 0);
    });
  }

  var ALL_CARDS_SEARCH_TRANSITION_MS = 420;

  if (allCardsSearchInput) {
    allCardsSearchInput.addEventListener('input', updateAllCardsSearchState);
    allCardsSearchInput.addEventListener('keyup', updateAllCardsSearchState);
    allCardsSearchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        collapseAllCardsSearch(true);
      }
    });
  }

  if (allCardsSearchClear && allCardsSearchInput) {
    allCardsSearchClear.addEventListener('click', function () {
      collapseAllCardsSearch(true);
    });
  }

  function collapseAllCardsSearch(focusTriggerAfterCollapse) {
    if (allCardsTopBarInner) allCardsTopBarInner.classList.remove('all-cards-search-expanded');
    if (allCardsSearchInput) {
      allCardsSearchInput.value = '';
      updateAllCardsSearchState();
    }
    if (focusTriggerAfterCollapse && allCardsSearchTriggerBtn) {
      setTimeout(function () { allCardsSearchTriggerBtn.focus(); }, ALL_CARDS_SEARCH_TRANSITION_MS);
    }
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
    if (addBtn) addBtn.classList.toggle('is-visible', tab === 'library' || tab === 'sublime');
    if (tab !== 'library' && tab !== 'sublime' && addWrap) addWrap.classList.remove('is-expanded');
    if (addLinkView && addLinkView.classList.contains('add-link-view--visible')) {
      closeAddLink();
    }
    if (addUploadView && addUploadView.classList.contains('add-upload-view--visible')) {
      closeAddUpload();
    }
    if (addCollectionView && addCollectionView.classList.contains('add-collection-view--visible')) {
      closeAddCollection();
    }
    if (addCanvasView && addCanvasView.classList.contains('add-canvas-view--visible')) {
      closeAddCanvas();
    }
    if (addNoteView && addNoteView.classList.contains('add-note-view--visible')) {
      closeAddNote();
    }
    if (collectionView) {
      collectionView.classList.remove('collection-view--visible');
      collectionView.setAttribute('aria-hidden', 'true');
      if (addWrap) addWrap.classList.remove('add-menu--on-collection');
    }
    if (allCardsView) {
      allCardsView.classList.remove('all-cards-view--visible');
      allCardsView.setAttribute('aria-hidden', 'true');
      if (addWrap) addWrap.classList.remove('add-menu--on-collection');
    }
    if (collectionsDirectoryView) {
      collectionsDirectoryView.classList.remove('collections-directory-view--visible');
      collectionsDirectoryView.setAttribute('aria-hidden', 'true');
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
      var onAllCards = allCardsView && allCardsView.classList.contains('all-cards-view--visible');
      var onCollectionsDirectory = collectionsDirectoryView && collectionsDirectoryView.classList.contains('collections-directory-view--visible');
      if (tab === activeTab && !onCollection && !onAllCards && !onCollectionsDirectory) return;
      setActive(tab);
    });
  });

  navItems.forEach(function (el) {
    el.classList.toggle('active', el.getAttribute('data-tab') === activeTab);
  });
  if (addBtn) addBtn.classList.toggle('is-visible', activeTab === 'library' || activeTab === 'sublime');
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
        var onCollection = collectionView && collectionView.classList.contains('collection-view--visible');
        var onAllCards = allCardsView && allCardsView.classList.contains('all-cards-view--visible');
        if (onCollection || onAllCards) {
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

  // --- Add Link page: open when + > Link ---
  function openAddLink() {
    if (!addLinkView) return;
    viewBeforeAddLink = null;
    if (libraryView && libraryView.classList.contains('library-view--visible')) {
      viewBeforeAddLink = 'library';
      libraryView.classList.remove('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'true');
    } else if (allCardsView && allCardsView.classList.contains('all-cards-view--visible')) {
      viewBeforeAddLink = 'all-cards';
      allCardsView.classList.remove('all-cards-view--visible');
      allCardsView.setAttribute('aria-hidden', 'true');
    } else if (collectionView && collectionView.classList.contains('collection-view--visible')) {
      viewBeforeAddLink = 'collection';
      collectionView.classList.remove('collection-view--visible');
      collectionView.setAttribute('aria-hidden', 'true');
    } else if (collectionsDirectoryView && collectionsDirectoryView.classList.contains('collections-directory-view--visible')) {
      viewBeforeAddLink = 'collections-directory';
      collectionsDirectoryView.classList.remove('collections-directory-view--visible');
      collectionsDirectoryView.setAttribute('aria-hidden', 'true');
    } else {
      viewBeforeAddLink = 'library';
      if (libraryView) {
        libraryView.classList.remove('library-view--visible');
        libraryView.setAttribute('aria-hidden', 'true');
      }
    }
    addLinkView.classList.add('add-link-view--visible');
    addLinkView.setAttribute('aria-hidden', 'false');
    document.body.classList.add('add-link-open');
    if (addWrap && addWrap.classList.contains('is-expanded')) {
      addWrap.classList.remove('is-expanded');
      if (addBtn) addBtn.setAttribute('aria-expanded', 'false');
      if (addMenu) addMenu.setAttribute('aria-hidden', 'true');
    }
    requestAnimationFrame(function () {
      var linkInput = document.getElementById('add-link-url');
      if (linkInput) linkInput.focus();
    });
  }

  function closeAddLink() {
    if (!addLinkView) return;
    document.body.classList.remove('add-link-open');
    addLinkView.classList.remove('add-link-view--visible');
    addLinkView.setAttribute('aria-hidden', 'true');
    if (viewBeforeAddLink === 'library' && libraryView) {
      libraryView.classList.add('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddLink === 'all-cards' && allCardsView) {
      allCardsView.classList.add('all-cards-view--visible');
      allCardsView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddLink === 'collection' && collectionView) {
      collectionView.classList.add('collection-view--visible');
      collectionView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddLink === 'collections-directory' && collectionsDirectoryView) {
      collectionsDirectoryView.classList.add('collections-directory-view--visible');
      collectionsDirectoryView.setAttribute('aria-hidden', 'false');
    } else if (libraryView) {
      libraryView.classList.add('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'false');
    }
    viewBeforeAddLink = null;
  }

  function openAddUpload() {
    if (!addUploadView) return;
    viewBeforeAddUpload = null;
    if (libraryView && libraryView.classList.contains('library-view--visible')) {
      viewBeforeAddUpload = 'library';
      libraryView.classList.remove('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'true');
    } else if (allCardsView && allCardsView.classList.contains('all-cards-view--visible')) {
      viewBeforeAddUpload = 'all-cards';
      allCardsView.classList.remove('all-cards-view--visible');
      allCardsView.setAttribute('aria-hidden', 'true');
    } else if (collectionView && collectionView.classList.contains('collection-view--visible')) {
      viewBeforeAddUpload = 'collection';
      collectionView.classList.remove('collection-view--visible');
      collectionView.setAttribute('aria-hidden', 'true');
    } else if (collectionsDirectoryView && collectionsDirectoryView.classList.contains('collections-directory-view--visible')) {
      viewBeforeAddUpload = 'collections-directory';
      collectionsDirectoryView.classList.remove('collections-directory-view--visible');
      collectionsDirectoryView.setAttribute('aria-hidden', 'true');
    } else {
      viewBeforeAddUpload = 'library';
      if (libraryView) {
        libraryView.classList.remove('library-view--visible');
        libraryView.setAttribute('aria-hidden', 'true');
      }
    }
    addUploadView.classList.add('add-upload-view--visible');
    addUploadView.setAttribute('aria-hidden', 'false');
    document.body.classList.add('add-upload-open');
    if (addWrap && addWrap.classList.contains('is-expanded')) {
      addWrap.classList.remove('is-expanded');
      if (addBtn) addBtn.setAttribute('aria-expanded', 'false');
      if (addMenu) addMenu.setAttribute('aria-hidden', 'true');
    }
  }

  function closeAddUpload() {
    if (!addUploadView) return;
    var list = addUploadView._uploadImagesList;
    if (list && list.length > 0) {
      list.forEach(function (e) { URL.revokeObjectURL(e.objectURL); });
      list.length = 0;
      var previewsEl = document.getElementById('add-upload-previews');
      if (previewsEl) {
        previewsEl.innerHTML = '';
        previewsEl.classList.remove('add-upload-previews--has-items');
        previewsEl.setAttribute('aria-hidden', 'true');
      }
      var emptyRow = document.getElementById('add-upload-files-empty');
      var addRow = document.getElementById('add-upload-files-add-row');
      if (emptyRow) { emptyRow.style.display = ''; emptyRow.setAttribute('aria-hidden', 'false'); }
      if (addRow) { addRow.style.display = 'none'; addRow.setAttribute('aria-hidden', 'true'); }
    }
    document.body.classList.remove('add-upload-open');
    addUploadView.classList.remove('add-upload-view--visible');
    addUploadView.setAttribute('aria-hidden', 'true');
    if (viewBeforeAddUpload === 'library' && libraryView) {
      libraryView.classList.add('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddUpload === 'all-cards' && allCardsView) {
      allCardsView.classList.add('all-cards-view--visible');
      allCardsView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddUpload === 'collection' && collectionView) {
      collectionView.classList.add('collection-view--visible');
      collectionView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddUpload === 'collections-directory' && collectionsDirectoryView) {
      collectionsDirectoryView.classList.add('collections-directory-view--visible');
      collectionsDirectoryView.setAttribute('aria-hidden', 'false');
    } else if (libraryView) {
      libraryView.classList.add('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'false');
    }
    viewBeforeAddUpload = null;
  }

  function openAddCollection() {
    if (!addCollectionView) return;
    viewBeforeAddCollection = null;
    if (libraryView && libraryView.classList.contains('library-view--visible')) {
      viewBeforeAddCollection = 'library';
      libraryView.classList.remove('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'true');
    } else if (allCardsView && allCardsView.classList.contains('all-cards-view--visible')) {
      viewBeforeAddCollection = 'all-cards';
      allCardsView.classList.remove('all-cards-view--visible');
      allCardsView.setAttribute('aria-hidden', 'true');
    } else if (collectionView && collectionView.classList.contains('collection-view--visible')) {
      viewBeforeAddCollection = 'collection';
      collectionView.classList.remove('collection-view--visible');
      collectionView.setAttribute('aria-hidden', 'true');
    } else if (collectionsDirectoryView && collectionsDirectoryView.classList.contains('collections-directory-view--visible')) {
      viewBeforeAddCollection = 'collections-directory';
      collectionsDirectoryView.classList.remove('collections-directory-view--visible');
      collectionsDirectoryView.setAttribute('aria-hidden', 'true');
    } else {
      viewBeforeAddCollection = 'library';
      if (libraryView) {
        libraryView.classList.remove('library-view--visible');
        libraryView.setAttribute('aria-hidden', 'true');
      }
    }
    addCollectionView.classList.add('add-collection-view--visible');
    addCollectionView.setAttribute('aria-hidden', 'false');
    document.body.classList.add('add-collection-open');
    if (addWrap && addWrap.classList.contains('is-expanded')) {
      addWrap.classList.remove('is-expanded');
      if (addBtn) addBtn.setAttribute('aria-expanded', 'false');
      if (addMenu) addMenu.setAttribute('aria-hidden', 'true');
    }
    requestAnimationFrame(function () {
      var nameInput = document.getElementById('add-collection-name');
      if (nameInput) nameInput.focus();
    });
  }

  function closeAddCollection() {
    if (!addCollectionView) return;
    document.body.classList.remove('add-collection-open');
    addCollectionView.classList.remove('add-collection-view--visible');
    addCollectionView.setAttribute('aria-hidden', 'true');
    if (viewBeforeAddCollection === 'library' && libraryView) {
      libraryView.classList.add('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddCollection === 'all-cards' && allCardsView) {
      allCardsView.classList.add('all-cards-view--visible');
      allCardsView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddCollection === 'collection' && collectionView) {
      collectionView.classList.add('collection-view--visible');
      collectionView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddCollection === 'collections-directory' && collectionsDirectoryView) {
      collectionsDirectoryView.classList.add('collections-directory-view--visible');
      collectionsDirectoryView.setAttribute('aria-hidden', 'false');
    } else if (libraryView) {
      libraryView.classList.add('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'false');
    }
    viewBeforeAddCollection = null;
  }

  function openAddCanvas() {
    if (!addCanvasView) return;
    viewBeforeAddCanvas = null;
    if (libraryView && libraryView.classList.contains('library-view--visible')) {
      viewBeforeAddCanvas = 'library';
      libraryView.classList.remove('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'true');
    } else if (allCardsView && allCardsView.classList.contains('all-cards-view--visible')) {
      viewBeforeAddCanvas = 'all-cards';
      allCardsView.classList.remove('all-cards-view--visible');
      allCardsView.setAttribute('aria-hidden', 'true');
    } else if (collectionView && collectionView.classList.contains('collection-view--visible')) {
      viewBeforeAddCanvas = 'collection';
      collectionView.classList.remove('collection-view--visible');
      collectionView.setAttribute('aria-hidden', 'true');
    } else if (collectionsDirectoryView && collectionsDirectoryView.classList.contains('collections-directory-view--visible')) {
      viewBeforeAddCanvas = 'collections-directory';
      collectionsDirectoryView.classList.remove('collections-directory-view--visible');
      collectionsDirectoryView.setAttribute('aria-hidden', 'true');
    } else {
      viewBeforeAddCanvas = 'library';
      if (libraryView) {
        libraryView.classList.remove('library-view--visible');
        libraryView.setAttribute('aria-hidden', 'true');
      }
    }
    addCanvasView.classList.add('add-canvas-view--visible');
    addCanvasView.setAttribute('aria-hidden', 'false');
    document.body.classList.add('add-canvas-open');
    if (addWrap && addWrap.classList.contains('is-expanded')) {
      addWrap.classList.remove('is-expanded');
      if (addBtn) addBtn.setAttribute('aria-expanded', 'false');
      if (addMenu) addMenu.setAttribute('aria-hidden', 'true');
    }
    requestAnimationFrame(function () {
      var nameInput = document.getElementById('add-canvas-name');
      if (nameInput) nameInput.focus();
    });
  }

  function openAddNote() {
    if (!addNoteView) return;
    viewBeforeAddNote = null;
    if (libraryView && libraryView.classList.contains('library-view--visible')) {
      viewBeforeAddNote = 'library';
      libraryView.classList.remove('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'true');
    } else if (allCardsView && allCardsView.classList.contains('all-cards-view--visible')) {
      viewBeforeAddNote = 'all-cards';
      allCardsView.classList.remove('all-cards-view--visible');
      allCardsView.setAttribute('aria-hidden', 'true');
    } else if (collectionView && collectionView.classList.contains('collection-view--visible')) {
      viewBeforeAddNote = 'collection';
      collectionView.classList.remove('collection-view--visible');
      collectionView.setAttribute('aria-hidden', 'true');
    } else if (collectionsDirectoryView && collectionsDirectoryView.classList.contains('collections-directory-view--visible')) {
      viewBeforeAddNote = 'collections-directory';
      collectionsDirectoryView.classList.remove('collections-directory-view--visible');
      collectionsDirectoryView.setAttribute('aria-hidden', 'true');
    } else {
      viewBeforeAddNote = 'library';
      if (libraryView) {
        libraryView.classList.remove('library-view--visible');
        libraryView.setAttribute('aria-hidden', 'true');
      }
    }
    addNoteView.classList.add('add-note-view--visible');
    addNoteView.setAttribute('aria-hidden', 'false');
    document.body.classList.add('add-note-open');
    if (addWrap && addWrap.classList.contains('is-expanded')) {
      addWrap.classList.remove('is-expanded');
      if (addBtn) addBtn.setAttribute('aria-expanded', 'false');
      if (addMenu) addMenu.setAttribute('aria-hidden', 'true');
    }
    requestAnimationFrame(function () {
      var editor = document.getElementById('add-note-editor');
      if (editor) editor.focus();
    });
  }

  function closeAddNote() {
    if (!addNoteView) return;
    document.body.classList.remove('add-note-open');
    addNoteView.classList.remove('add-note-view--visible');
    addNoteView.setAttribute('aria-hidden', 'true');
    if (viewBeforeAddNote === 'library' && libraryView) {
      libraryView.classList.add('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddNote === 'all-cards' && allCardsView) {
      allCardsView.classList.add('all-cards-view--visible');
      allCardsView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddNote === 'collection' && collectionView) {
      collectionView.classList.add('collection-view--visible');
      collectionView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddNote === 'collections-directory' && collectionsDirectoryView) {
      collectionsDirectoryView.classList.add('collections-directory-view--visible');
      collectionsDirectoryView.setAttribute('aria-hidden', 'false');
    } else if (libraryView) {
      libraryView.classList.add('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'false');
    }
    viewBeforeAddNote = null;
  }

  function closeAddCanvas() {
    if (!addCanvasView) return;
    document.body.classList.remove('add-canvas-open');
    addCanvasView.classList.remove('add-canvas-view--visible');
    addCanvasView.setAttribute('aria-hidden', 'true');
    if (viewBeforeAddCanvas === 'library' && libraryView) {
      libraryView.classList.add('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddCanvas === 'all-cards' && allCardsView) {
      allCardsView.classList.add('all-cards-view--visible');
      allCardsView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddCanvas === 'collection' && collectionView) {
      collectionView.classList.add('collection-view--visible');
      collectionView.setAttribute('aria-hidden', 'false');
    } else if (viewBeforeAddCanvas === 'collections-directory' && collectionsDirectoryView) {
      collectionsDirectoryView.classList.add('collections-directory-view--visible');
      collectionsDirectoryView.setAttribute('aria-hidden', 'false');
    } else if (libraryView) {
      libraryView.classList.add('library-view--visible');
      libraryView.setAttribute('aria-hidden', 'false');
    }
    viewBeforeAddCanvas = null;
  }

  if (addLinkView) {
    var addLinkClose = document.getElementById('add-link-close');
    var addLinkModal = document.getElementById('add-link-modal');
    var addLinkForm = document.getElementById('add-link-form');
    var addLinkUrlInput = document.getElementById('add-link-url');
    var addLinkNoteInput = document.getElementById('add-link-note');
    var addLinkPrivateToggle = document.getElementById('add-link-private-toggle');
    var addLinkFavoriteToggle = document.getElementById('add-link-favorite-toggle');
    var addLinkCollectionsEmpty = document.getElementById('add-link-collections-empty');

    if (addLinkClose) addLinkClose.addEventListener('click', closeAddLink);

    if (addLinkForm) {
      addLinkForm.addEventListener('submit', function (e) {
        e.preventDefault();
        closeAddLink();
      });
    }

    if (addLinkPrivateToggle) {
      addLinkPrivateToggle.addEventListener('click', function () {
        var on = this.getAttribute('aria-checked') === 'true';
        this.setAttribute('aria-checked', !on);
      });
    }
    if (addLinkFavoriteToggle) {
      addLinkFavoriteToggle.addEventListener('click', function () {
        var on = this.getAttribute('aria-checked') === 'true';
        this.setAttribute('aria-checked', !on);
      });
    }

    var addLinkUrlWrap = document.getElementById('add-link-url-wrap');
    var addLinkNoteWrap = document.getElementById('add-link-note-wrap');
    if (addLinkUrlInput && addLinkUrlWrap) {
      function syncAddLinkUrlPlaceholder() {
        var hasValue = (addLinkUrlInput.value || '').trim().length > 0;
        addLinkUrlWrap.classList.toggle('add-link-field-wrap--has-value', hasValue);
        addLinkUrlInput.classList.toggle('add-link-input--url', hasValue);
      }
      addLinkUrlInput.addEventListener('input', syncAddLinkUrlPlaceholder);
      addLinkUrlInput.addEventListener('focus', syncAddLinkUrlPlaceholder);
      addLinkUrlInput.addEventListener('blur', syncAddLinkUrlPlaceholder);
      syncAddLinkUrlPlaceholder();
    }
    if (addLinkNoteInput && addLinkNoteWrap) {
      function syncAddLinkNotePlaceholder() {
        addLinkNoteWrap.classList.toggle('add-link-field-wrap--has-value', (addLinkNoteInput.value || '').trim().length > 0);
      }
      addLinkNoteInput.addEventListener('input', syncAddLinkNotePlaceholder);
      addLinkNoteInput.addEventListener('focus', syncAddLinkNotePlaceholder);
      addLinkNoteInput.addEventListener('blur', syncAddLinkNotePlaceholder);
      syncAddLinkNotePlaceholder();
    }

    document.querySelectorAll('.add-link-toggle-row').forEach(function (row) {
      var toggle = row.querySelector('.add-link-toggle');
      if (!toggle) return;
      row.addEventListener('click', function (e) {
        if (e.target === toggle || toggle.contains(e.target)) return;
        e.preventDefault();
        var on = toggle.getAttribute('aria-checked') === 'true';
        toggle.setAttribute('aria-checked', !on);
      });
    });

    var ADD_LINK_NOTE_MIN_HEIGHT = 88;
    var ADD_LINK_NOTE_MAX_HEIGHT = 200;
    if (addLinkNoteInput) {
      function growAddLinkNote() {
        addLinkNoteInput.style.height = 'auto';
        var h = addLinkNoteInput.scrollHeight;
        addLinkNoteInput.style.height = Math.max(ADD_LINK_NOTE_MIN_HEIGHT, Math.min(h, ADD_LINK_NOTE_MAX_HEIGHT)) + 'px';
      }
      addLinkNoteInput.addEventListener('input', growAddLinkNote);
      addLinkNoteInput.addEventListener('focus', growAddLinkNote);
    }

    var addLinkCollectionsList = document.getElementById('add-link-collections-list');
    var addLinkCollectionsListWrap = document.getElementById('add-link-collections-list-wrap');
    var ADD_LINK_COLLECTION_NAMES = [
      'Self-nullification',
      'Child wisdom',
      'Artifacts',
      'Where is my 🧀🧀🧀??',
      'Nice words sent my way',
      'Reading list',
      'Ideas',
      'My Canon',
      'Design inspiration',
      'Anti-Networking Event'
    ];
    var addLinkCollectionNameIndex = 0;

    function updateAddLinkCollectionsVisibility() {
      var list = addLinkCollectionsList;
      var hasItems = list && list.children.length > 0;
      if (addLinkCollectionsEmpty) {
        addLinkCollectionsEmpty.style.display = hasItems ? 'none' : '';
        addLinkCollectionsEmpty.setAttribute('aria-hidden', hasItems);
      }
      if (addLinkCollectionsListWrap) {
        addLinkCollectionsListWrap.classList.toggle('add-link-collections-list-wrap--visible', hasItems);
        addLinkCollectionsListWrap.setAttribute('aria-hidden', !hasItems);
      }
    }

    function addLinkAddCollectionRow() {
      if (!addLinkCollectionsList) return;
      var name = ADD_LINK_COLLECTION_NAMES[addLinkCollectionNameIndex % ADD_LINK_COLLECTION_NAMES.length];
      addLinkCollectionNameIndex += 1;
      var row = document.createElement('div');
      row.className = 'add-link-collection-item';
      row.setAttribute('role', 'listitem');
      var icon = document.createElement('img');
      icon.src = '../assets/999.svg';
      icon.alt = '';
      icon.width = 25;
      icon.height = 25;
      icon.className = 'add-link-collections-icon';
      icon.setAttribute('aria-hidden', 'true');
      var nameEl = document.createElement('span');
      nameEl.className = 'add-link-collection-item-name';
      nameEl.textContent = name;
      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'add-link-collection-item-remove';
      removeBtn.setAttribute('aria-label', 'Remove ' + name);
      removeBtn.innerHTML = '<img src="../assets/close.svg" alt="" width="25" height="25" />';
      removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        row.remove();
        updateAddLinkCollectionsVisibility();
      });
      row.appendChild(icon);
      row.appendChild(nameEl);
      row.appendChild(removeBtn);
      addLinkCollectionsList.insertBefore(row, addLinkCollectionsList.firstChild);
      updateAddLinkCollectionsVisibility();
    }

    var addLinkAddCollectionBtn = document.getElementById('add-link-add-collection-btn');
    var addLinkAddCollectionRowBtn = document.getElementById('add-link-add-collection-row');
    if (addLinkCollectionsEmpty) {
      addLinkCollectionsEmpty.addEventListener('click', function (e) {
        if (e.target === addLinkAddCollectionBtn || addLinkAddCollectionBtn.contains(e.target)) return;
        addLinkAddCollectionRow();
      });
    }
    if (addLinkAddCollectionBtn) {
      addLinkAddCollectionBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        addLinkAddCollectionRow();
      });
    }
    if (addLinkAddCollectionRowBtn) {
      addLinkAddCollectionRowBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        addLinkAddCollectionRow();
      });
    }
  }

  if (saveFromCardOverlay) {
    var saveFromCardNoteInput = document.getElementById('save-from-card-note');
    var saveFromCardNoteWrap = document.getElementById('save-from-card-note-wrap');
    var saveFromCardPrivateToggle = document.getElementById('save-from-card-private-toggle');
    var saveFromCardFavoriteToggle = document.getElementById('save-from-card-favorite-toggle');
    var saveFromCardCollectionsEmpty = document.getElementById('save-from-card-collections-empty');
    var saveFromCardCollectionsList = document.getElementById('save-from-card-collections-list');
    var saveFromCardCollectionsListWrap = document.getElementById('save-from-card-collections-list-wrap');
    var saveFromCardAddCollectionBtn = document.getElementById('save-from-card-add-collection-btn');
    var saveFromCardAddCollectionRowBtn = document.getElementById('save-from-card-add-collection-row');
    var SAVE_FROM_CARD_COLLECTION_NAMES = ['Child wisdom', 'Artifacts', 'Reading list', 'Ideas', 'My Canon', 'Design inspiration', 'Where is my 🧀🧀🧀??', 'Nice words sent my way', 'Anti-Networking Event'];
    var saveFromCardCollectionNameIndex = 0;

    saveFromCardOverlay.addEventListener('click', function (e) {
      if (e.target === saveFromCardOverlay) closeSaveFromCardModal();
    });
    if (saveFromCardForm) {
      saveFromCardForm.addEventListener('submit', function (e) {
        e.preventDefault();
        applySavedStateToCard();
        closeSaveFromCardModal();
      });
    }
    if (saveFromCardNoteInput && saveFromCardNoteWrap) {
      function syncSaveFromCardNotePlaceholder() {
        saveFromCardNoteWrap.classList.toggle('add-link-field-wrap--has-value', (saveFromCardNoteInput.value || '').trim().length > 0);
      }
      saveFromCardNoteInput.addEventListener('input', syncSaveFromCardNotePlaceholder);
      saveFromCardNoteInput.addEventListener('focus', syncSaveFromCardNotePlaceholder);
      saveFromCardNoteInput.addEventListener('blur', syncSaveFromCardNotePlaceholder);
    }
    if (saveFromCardPrivateToggle) {
      saveFromCardPrivateToggle.addEventListener('click', function () {
        var on = this.getAttribute('aria-checked') === 'true';
        this.setAttribute('aria-checked', !on);
      });
    }
    if (saveFromCardFavoriteToggle) {
      saveFromCardFavoriteToggle.addEventListener('click', function () {
        var on = this.getAttribute('aria-checked') === 'true';
        this.setAttribute('aria-checked', !on);
      });
    }
    document.querySelectorAll('#save-from-card-collections-wrap .add-link-toggle-row').forEach(function (row) {
      var toggle = row.querySelector('.add-link-toggle');
      if (!toggle) return;
      row.addEventListener('click', function (e) {
        if (e.target === toggle || toggle.contains(e.target)) return;
        e.preventDefault();
        var on = toggle.getAttribute('aria-checked') === 'true';
        toggle.setAttribute('aria-checked', !on);
      });
    });
    function updateSaveFromCardCollectionsVisibility() {
      var hasItems = saveFromCardCollectionsList && saveFromCardCollectionsList.children.length > 0;
      if (saveFromCardCollectionsEmpty) {
        saveFromCardCollectionsEmpty.style.display = hasItems ? 'none' : '';
        saveFromCardCollectionsEmpty.setAttribute('aria-hidden', hasItems);
      }
      if (saveFromCardCollectionsListWrap) {
        saveFromCardCollectionsListWrap.classList.toggle('add-link-collections-list-wrap--visible', hasItems);
        saveFromCardCollectionsListWrap.setAttribute('aria-hidden', !hasItems);
      }
    }
    function saveFromCardAddCollectionRow() {
      if (!saveFromCardCollectionsList) return;
      var name = SAVE_FROM_CARD_COLLECTION_NAMES[saveFromCardCollectionNameIndex % SAVE_FROM_CARD_COLLECTION_NAMES.length];
      saveFromCardCollectionNameIndex += 1;
      var row = document.createElement('div');
      row.className = 'add-link-collection-item';
      row.setAttribute('role', 'listitem');
      var icon = document.createElement('img');
      icon.src = '../assets/999.svg';
      icon.alt = '';
      icon.width = 25;
      icon.height = 25;
      icon.className = 'add-link-collections-icon';
      icon.setAttribute('aria-hidden', 'true');
      var nameEl = document.createElement('span');
      nameEl.className = 'add-link-collection-item-name';
      nameEl.textContent = name;
      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'add-link-collection-item-remove';
      removeBtn.setAttribute('aria-label', 'Remove ' + name);
      removeBtn.innerHTML = '<img src="../assets/close.svg" alt="" width="25" height="25" />';
      removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        row.remove();
        updateSaveFromCardCollectionsVisibility();
      });
      row.appendChild(icon);
      row.appendChild(nameEl);
      row.appendChild(removeBtn);
      saveFromCardCollectionsList.insertBefore(row, saveFromCardCollectionsList.firstChild);
      updateSaveFromCardCollectionsVisibility();
    }
    if (saveFromCardCollectionsEmpty) {
      saveFromCardCollectionsEmpty.addEventListener('click', function (e) {
        if (e.target === saveFromCardAddCollectionBtn || (saveFromCardAddCollectionBtn && saveFromCardAddCollectionBtn.contains(e.target))) return;
        saveFromCardAddCollectionRow();
      });
    }
    if (saveFromCardAddCollectionBtn) {
      saveFromCardAddCollectionBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        saveFromCardAddCollectionRow();
      });
    }
    if (saveFromCardAddCollectionRowBtn) {
      saveFromCardAddCollectionRowBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        saveFromCardAddCollectionRow();
      });
    }
  }

  if (addUploadView) {
    var addUploadClose = document.getElementById('add-upload-close');
    var addUploadForm = document.getElementById('add-upload-form');
    var addUploadFilesWrap = document.getElementById('add-upload-files-wrap');
    var addUploadFilesEmpty = document.getElementById('add-upload-files-empty');
    var addUploadFilesAddRow = document.getElementById('add-upload-files-add-row');
    var addUploadFileInput = document.getElementById('add-upload-file-input');
    var addUploadPreviews = document.getElementById('add-upload-previews');
    var addUploadSourceInput = document.getElementById('add-upload-source');
    var addUploadSourceWrap = document.getElementById('add-upload-source-wrap');
    var addUploadNoteInput = document.getElementById('add-upload-note');
    var addUploadNoteWrap = document.getElementById('add-upload-note-wrap');
    var addUploadPrivateToggle = document.getElementById('add-upload-private-toggle');
    var addUploadFavoriteToggle = document.getElementById('add-upload-favorite-toggle');
    var addUploadCollectionsEmpty = document.getElementById('add-upload-collections-empty');
    var addUploadCollectionsList = document.getElementById('add-upload-collections-list');
    var addUploadCollectionsListWrap = document.getElementById('add-upload-collections-list-wrap');
    var addUploadAddCollectionBtn = document.getElementById('add-upload-add-collection-btn');
    var addUploadAddCollectionRowBtn = document.getElementById('add-upload-add-collection-row');

    var addUploadImagesList = [];
    addUploadView._uploadImagesList = addUploadImagesList;

    if (addUploadClose) addUploadClose.addEventListener('click', closeAddUpload);

    if (addUploadForm) {
      addUploadForm.addEventListener('submit', function (e) {
        e.preventDefault();
        closeAddUpload();
      });
    }

    function updateAddUploadFilesVisibility() {
      var hasFiles = addUploadImagesList.length > 0;
      if (addUploadFilesEmpty) {
        addUploadFilesEmpty.style.display = hasFiles ? 'none' : '';
        addUploadFilesEmpty.setAttribute('aria-hidden', hasFiles);
      }
      if (addUploadFilesAddRow) {
        addUploadFilesAddRow.style.display = hasFiles ? '' : 'none';
        addUploadFilesAddRow.setAttribute('aria-hidden', !hasFiles);
      }
    }

    function triggerAddUploadFileInput() {
      if (addUploadFileInput) addUploadFileInput.click();
    }

    if (addUploadFilesEmpty && addUploadFileInput) {
      addUploadFilesEmpty.addEventListener('click', triggerAddUploadFileInput);
      addUploadFilesEmpty.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerAddUploadFileInput();
        }
      });
    }
    if (addUploadFilesAddRow && addUploadFileInput) {
      addUploadFilesAddRow.addEventListener('click', triggerAddUploadFileInput);
      addUploadFilesAddRow.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerAddUploadFileInput();
        }
      });
    }

    if (addUploadFileInput && addUploadPreviews) {
      addUploadFileInput.addEventListener('change', function () {
        var files = this.files;
        if (!files || files.length === 0) return;
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (!file.type || file.type.indexOf('image/') !== 0) continue;
          var objectURL = URL.createObjectURL(file);
          addUploadImagesList.push({ file: file, objectURL: objectURL });
          var item = document.createElement('div');
          item.className = 'add-upload-preview-item';
          item.setAttribute('role', 'listitem');
          var img = document.createElement('img');
          img.src = objectURL;
          img.alt = '';
          img.setAttribute('aria-hidden', 'true');
          var removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.className = 'add-upload-preview-remove';
          removeBtn.setAttribute('aria-label', 'Remove image');
          var removeIcon = document.createElement('img');
          removeIcon.src = '../assets/close.svg';
          removeIcon.alt = '';
          removeIcon.width = 15;
          removeIcon.height = 15;
          removeBtn.appendChild(removeIcon);
          (function (objUrl, entry, el) {
            removeBtn.addEventListener('click', function (e) {
              e.stopPropagation();
              URL.revokeObjectURL(objUrl);
              var idx = addUploadImagesList.indexOf(entry);
              if (idx !== -1) addUploadImagesList.splice(idx, 1);
              el.remove();
              if (addUploadPreviews && addUploadImagesList.length === 0) {
                addUploadPreviews.classList.remove('add-upload-previews--has-items');
                addUploadPreviews.setAttribute('aria-hidden', 'true');
              }
              updateAddUploadFilesVisibility();
            });
          })(objectURL, addUploadImagesList[addUploadImagesList.length - 1], item);
          item.appendChild(img);
          item.appendChild(removeBtn);
          addUploadPreviews.appendChild(item);
        }
        addUploadPreviews.classList.add('add-upload-previews--has-items');
        addUploadPreviews.setAttribute('aria-hidden', 'false');
        updateAddUploadFilesVisibility();
        addUploadFileInput.value = '';
      });
    }

    if (addUploadSourceInput && addUploadSourceWrap) {
      function syncAddUploadSourcePlaceholder() {
        var hasValue = (addUploadSourceInput.value || '').trim().length > 0;
        addUploadSourceWrap.classList.toggle('add-link-field-wrap--has-value', hasValue);
        addUploadSourceInput.classList.toggle('add-link-input--url', hasValue);
      }
      addUploadSourceInput.addEventListener('input', syncAddUploadSourcePlaceholder);
      addUploadSourceInput.addEventListener('focus', syncAddUploadSourcePlaceholder);
      addUploadSourceInput.addEventListener('blur', syncAddUploadSourcePlaceholder);
      syncAddUploadSourcePlaceholder();
    }
    if (addUploadNoteInput && addUploadNoteWrap) {
      function syncAddUploadNotePlaceholder() {
        addUploadNoteWrap.classList.toggle('add-link-field-wrap--has-value', (addUploadNoteInput.value || '').trim().length > 0);
      }
      addUploadNoteInput.addEventListener('input', syncAddUploadNotePlaceholder);
      addUploadNoteInput.addEventListener('focus', syncAddUploadNotePlaceholder);
      addUploadNoteInput.addEventListener('blur', syncAddUploadNotePlaceholder);
      syncAddUploadNotePlaceholder();
    }
    var ADD_UPLOAD_NOTE_MIN_HEIGHT = 88;
    var ADD_UPLOAD_NOTE_MAX_HEIGHT = 200;
    if (addUploadNoteInput) {
      function growAddUploadNote() {
        addUploadNoteInput.style.height = 'auto';
        var h = addUploadNoteInput.scrollHeight;
        addUploadNoteInput.style.height = Math.max(ADD_UPLOAD_NOTE_MIN_HEIGHT, Math.min(h, ADD_UPLOAD_NOTE_MAX_HEIGHT)) + 'px';
      }
      addUploadNoteInput.addEventListener('input', growAddUploadNote);
      addUploadNoteInput.addEventListener('focus', growAddUploadNote);
    }

    if (addUploadPrivateToggle) {
      addUploadPrivateToggle.addEventListener('click', function () {
        var on = this.getAttribute('aria-checked') === 'true';
        this.setAttribute('aria-checked', !on);
      });
    }
    if (addUploadFavoriteToggle) {
      addUploadFavoriteToggle.addEventListener('click', function () {
        var on = this.getAttribute('aria-checked') === 'true';
        this.setAttribute('aria-checked', !on);
      });
    }

    /* Whole-row click for Private/Favorite: handled once globally for all .add-link-toggle-row (link + upload) above, so no duplicate here */

    var addUploadCollectionNameIndex = 0;
    var ADD_UPLOAD_COLLECTION_NAMES = [
      'Self-nullification', 'Child wisdom', 'Artifacts', 'Where is my 🧀🧀🧀??',
      'Nice words sent my way', 'Reading list', 'Ideas', 'My Canon', 'Design inspiration', 'Anti-Networking Event'
    ];

    function updateAddUploadCollectionsVisibility() {
      var hasItems = addUploadCollectionsList && addUploadCollectionsList.children.length > 0;
      if (addUploadCollectionsEmpty) {
        addUploadCollectionsEmpty.style.display = hasItems ? 'none' : '';
        addUploadCollectionsEmpty.setAttribute('aria-hidden', hasItems);
      }
      if (addUploadCollectionsListWrap) {
        addUploadCollectionsListWrap.classList.toggle('add-link-collections-list-wrap--visible', hasItems);
        addUploadCollectionsListWrap.setAttribute('aria-hidden', !hasItems);
      }
    }

    function addUploadAddCollectionRow() {
      if (!addUploadCollectionsList) return;
      var name = ADD_UPLOAD_COLLECTION_NAMES[addUploadCollectionNameIndex % ADD_UPLOAD_COLLECTION_NAMES.length];
      addUploadCollectionNameIndex += 1;
      var row = document.createElement('div');
      row.className = 'add-link-collection-item';
      row.setAttribute('role', 'listitem');
      var icon = document.createElement('img');
      icon.src = '../assets/999.svg';
      icon.alt = '';
      icon.width = 25;
      icon.height = 25;
      icon.className = 'add-link-collections-icon';
      icon.setAttribute('aria-hidden', 'true');
      var nameEl = document.createElement('span');
      nameEl.className = 'add-link-collection-item-name';
      nameEl.textContent = name;
      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'add-link-collection-item-remove';
      removeBtn.setAttribute('aria-label', 'Remove ' + name);
      removeBtn.innerHTML = '<img src="../assets/close.svg" alt="" width="25" height="25" />';
      removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        row.remove();
        updateAddUploadCollectionsVisibility();
      });
      row.appendChild(icon);
      row.appendChild(nameEl);
      row.appendChild(removeBtn);
      addUploadCollectionsList.insertBefore(row, addUploadCollectionsList.firstChild);
      updateAddUploadCollectionsVisibility();
    }

    if (addUploadCollectionsEmpty) {
      addUploadCollectionsEmpty.addEventListener('click', function (e) {
        if (e.target === addUploadAddCollectionBtn || (addUploadAddCollectionBtn && addUploadAddCollectionBtn.contains(e.target))) return;
        addUploadAddCollectionRow();
      });
    }
    if (addUploadAddCollectionBtn) {
      addUploadAddCollectionBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        addUploadAddCollectionRow();
      });
    }
    if (addUploadAddCollectionRowBtn) {
      addUploadAddCollectionRowBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        addUploadAddCollectionRow();
      });
    }
  }

  if (addCollectionView) {
    var addCollectionClose = document.getElementById('add-collection-close');
    var addCollectionForm = document.getElementById('add-collection-form');
    var addCollectionNameInput = document.getElementById('add-collection-name');
    var addCollectionNameWrap = document.getElementById('add-collection-name-wrap');
    var addCollectionDescInput = document.getElementById('add-collection-desc');
    var addCollectionDescWrap = document.getElementById('add-collection-desc-wrap');
    var addCollectionPrivateToggle = document.getElementById('add-collection-private-toggle');
    var addCollectionCollaboratorsEmpty = document.getElementById('add-collection-collaborators-empty');
    var addCollectionCollaboratorsBtn = document.getElementById('add-collection-collaborators-btn');
    var addCollectionCollaboratorsList = document.getElementById('add-collection-collaborators-list');
    var addCollectionCollaboratorsListWrap = document.getElementById('add-collection-collaborators-list-wrap');
    var addCollectionAddCollaboratorRowBtn = document.getElementById('add-collection-add-collaborator-row');

    if (addCollectionClose) addCollectionClose.addEventListener('click', closeAddCollection);

    if (addCollectionPrivateToggle) {
      addCollectionPrivateToggle.addEventListener('click', function () {
        var on = this.getAttribute('aria-checked') === 'true';
        this.setAttribute('aria-checked', !on);
      });
    }

    var ADD_COLLECTION_COLLABORATOR_NAMES = [
      'Joel', 'David Anastacio', 'Maria Chen', 'Alex Rivera', 'Sam Kim',
      'Jordan Taylor', 'Riley Morgan', 'Casey Lee', 'Jamie Fox', 'Morgan Reed'
    ];
    var ADD_COLLECTION_COLLABORATOR_AVATARS = [
      'https://randomuser.me/api/portraits/med/men/32.jpg',
      'https://randomuser.me/api/portraits/med/men/22.jpg',
      'https://randomuser.me/api/portraits/med/women/44.jpg',
      'https://randomuser.me/api/portraits/med/men/67.jpg',
      'https://randomuser.me/api/portraits/med/women/65.jpg',
      'https://randomuser.me/api/portraits/med/men/75.jpg',
      'https://randomuser.me/api/portraits/med/women/33.jpg',
      'https://randomuser.me/api/portraits/med/men/15.jpg',
      'https://randomuser.me/api/portraits/med/women/68.jpg',
      'https://randomuser.me/api/portraits/med/men/81.jpg'
    ];
    var addCollectionCollaboratorNameIndex = 0;

    function updateAddCollectionCollaboratorsVisibility() {
      var hasItems = addCollectionCollaboratorsList && addCollectionCollaboratorsList.children.length > 0;
      if (addCollectionCollaboratorsEmpty) {
        addCollectionCollaboratorsEmpty.style.display = hasItems ? 'none' : '';
        addCollectionCollaboratorsEmpty.setAttribute('aria-hidden', hasItems);
      }
      if (addCollectionCollaboratorsListWrap) {
        addCollectionCollaboratorsListWrap.classList.toggle('add-link-collections-list-wrap--visible', hasItems);
        addCollectionCollaboratorsListWrap.setAttribute('aria-hidden', !hasItems);
      }
    }

    function addCollectionAddCollaboratorRow() {
      if (!addCollectionCollaboratorsList) return;
      var name = ADD_COLLECTION_COLLABORATOR_NAMES[addCollectionCollaboratorNameIndex % ADD_COLLECTION_COLLABORATOR_NAMES.length];
      addCollectionCollaboratorNameIndex += 1;
      var row = document.createElement('div');
      row.className = 'add-collection-collaborator-item';
      row.setAttribute('role', 'listitem');
      var avatarWrap = document.createElement('div');
      avatarWrap.className = 'add-collection-collaborator-avatar';
      var avatarInner = document.createElement('div');
      avatarInner.className = 'add-collection-collaborator-avatar-inner';
      var avatarImg = document.createElement('img');
      var avatarIndex = (addCollectionCollaboratorNameIndex - 1) % ADD_COLLECTION_COLLABORATOR_AVATARS.length;
      if (avatarIndex < 0) avatarIndex += ADD_COLLECTION_COLLABORATOR_AVATARS.length;
      avatarImg.src = ADD_COLLECTION_COLLABORATOR_AVATARS[avatarIndex];
      avatarImg.alt = '';
      avatarImg.width = 18.18;
      avatarImg.height = 18.18;
      avatarImg.className = 'add-collection-collaborator-avatar-img';
      avatarImg.setAttribute('aria-hidden', 'true');
      avatarInner.appendChild(avatarImg);
      avatarWrap.appendChild(avatarInner);
      var nameEl = document.createElement('span');
      nameEl.className = 'add-collection-collaborator-name';
      nameEl.textContent = name;
      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'add-link-collection-item-remove';
      removeBtn.setAttribute('aria-label', 'Remove ' + name);
      removeBtn.innerHTML = '<img src="../assets/close.svg" alt="" width="25" height="25" />';
      removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        row.remove();
        updateAddCollectionCollaboratorsVisibility();
      });
      row.appendChild(avatarWrap);
      row.appendChild(nameEl);
      row.appendChild(removeBtn);
      addCollectionCollaboratorsList.insertBefore(row, addCollectionCollaboratorsList.firstChild);
      updateAddCollectionCollaboratorsVisibility();
    }

    if (addCollectionCollaboratorsEmpty) {
      addCollectionCollaboratorsEmpty.addEventListener('click', function (e) {
        if (e.target === addCollectionCollaboratorsBtn || addCollectionCollaboratorsBtn.contains(e.target)) return;
        addCollectionAddCollaboratorRow();
      });
    }
    if (addCollectionCollaboratorsBtn) {
      addCollectionCollaboratorsBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        addCollectionAddCollaboratorRow();
      });
    }
    if (addCollectionAddCollaboratorRowBtn) {
      addCollectionAddCollaboratorRowBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        addCollectionAddCollaboratorRow();
      });
    }

    if (addCollectionForm) {
      addCollectionForm.addEventListener('submit', function (e) {
        e.preventDefault();
        closeAddCollection();
      });
    }

    if (addCollectionNameInput && addCollectionNameWrap) {
      function syncAddCollectionNamePlaceholder() {
        var hasValue = (addCollectionNameInput.value || '').trim().length > 0;
        addCollectionNameWrap.classList.toggle('add-link-field-wrap--has-value', hasValue);
      }
      addCollectionNameInput.addEventListener('input', syncAddCollectionNamePlaceholder);
      addCollectionNameInput.addEventListener('focus', syncAddCollectionNamePlaceholder);
      addCollectionNameInput.addEventListener('blur', syncAddCollectionNamePlaceholder);
      syncAddCollectionNamePlaceholder();
    }
    if (addCollectionDescInput && addCollectionDescWrap) {
      function syncAddCollectionDescPlaceholder() {
        addCollectionDescWrap.classList.toggle('add-link-field-wrap--has-value', (addCollectionDescInput.value || '').trim().length > 0);
      }
      addCollectionDescInput.addEventListener('input', syncAddCollectionDescPlaceholder);
      addCollectionDescInput.addEventListener('focus', syncAddCollectionDescPlaceholder);
      addCollectionDescInput.addEventListener('blur', syncAddCollectionDescPlaceholder);
      syncAddCollectionDescPlaceholder();
    }

    var ADD_COLLECTION_DESC_MIN_HEIGHT = 88;
    var ADD_COLLECTION_DESC_MAX_HEIGHT = 200;
    if (addCollectionDescInput) {
      function growAddCollectionDesc() {
        addCollectionDescInput.style.height = 'auto';
        var h = addCollectionDescInput.scrollHeight;
        addCollectionDescInput.style.height = Math.max(ADD_COLLECTION_DESC_MIN_HEIGHT, Math.min(h, ADD_COLLECTION_DESC_MAX_HEIGHT)) + 'px';
      }
      addCollectionDescInput.addEventListener('input', growAddCollectionDesc);
      addCollectionDescInput.addEventListener('focus', growAddCollectionDesc);
    }

  }

  if (addCanvasView) {
    var addCanvasClose = document.getElementById('add-canvas-close');
    var addCanvasForm = document.getElementById('add-canvas-form');
    var addCanvasNameInput = document.getElementById('add-canvas-name');
    var addCanvasNameWrap = document.getElementById('add-canvas-name-wrap');
    var addCanvasCollectionsEmpty = document.getElementById('add-canvas-collections-empty');
    var addCanvasCollectionsBtn = document.getElementById('add-canvas-collections-btn');
    var addCanvasCollectionsList = document.getElementById('add-canvas-collections-list');
    var addCanvasCollectionsListWrap = document.getElementById('add-canvas-collections-list-wrap');
    var addCanvasAddCollectionRowBtn = document.getElementById('add-canvas-add-collection-row');
    var addCanvasAutoSyncToggle = document.getElementById('add-canvas-auto-sync-toggle');
    var addCanvasCollaboratorsEmpty = document.getElementById('add-canvas-collaborators-empty');
    var addCanvasCollaboratorsBtn = document.getElementById('add-canvas-collaborators-btn');
    var addCanvasCollaboratorsList = document.getElementById('add-canvas-collaborators-list');
    var addCanvasCollaboratorsListWrap = document.getElementById('add-canvas-collaborators-list-wrap');
    var addCanvasAddCollaboratorRowBtn = document.getElementById('add-canvas-add-collaborator-row');

    if (addCanvasClose) addCanvasClose.addEventListener('click', closeAddCanvas);

    if (addCanvasForm) {
      addCanvasForm.addEventListener('submit', function (e) {
        e.preventDefault();
        closeAddCanvas();
      });
    }

    if (addCanvasNameInput && addCanvasNameWrap) {
      function syncAddCanvasNamePlaceholder() {
        var hasValue = (addCanvasNameInput.value || '').trim().length > 0;
        addCanvasNameWrap.classList.toggle('add-link-field-wrap--has-value', hasValue);
      }
      addCanvasNameInput.addEventListener('input', syncAddCanvasNamePlaceholder);
      addCanvasNameInput.addEventListener('focus', syncAddCanvasNamePlaceholder);
      addCanvasNameInput.addEventListener('blur', syncAddCanvasNamePlaceholder);
      syncAddCanvasNamePlaceholder();
    }

    var ADD_CANVAS_COLLECTION_NAMES = [
      'Self-nullification', 'Child wisdom', 'Artifacts', 'Where is my 🧀🧀🧀??',
      'Nice words sent my way', 'Reading list', 'Ideas', 'My Canon', 'Design inspiration', 'Anti-Networking Event'
    ];
    var addCanvasCollectionNameIndex = 0;

    var addCanvasAutoSyncLabel = document.getElementById('add-canvas-auto-sync-label');

    function updateAddCanvasCollectionsVisibility() {
      var hasItems = addCanvasCollectionsList && addCanvasCollectionsList.children.length > 0;
      if (addCanvasCollectionsEmpty) {
        addCanvasCollectionsEmpty.style.display = hasItems ? 'none' : '';
        addCanvasCollectionsEmpty.setAttribute('aria-hidden', hasItems);
      }
      if (addCanvasCollectionsListWrap) {
        addCanvasCollectionsListWrap.classList.toggle('add-link-collections-list-wrap--visible', hasItems);
        addCanvasCollectionsListWrap.setAttribute('aria-hidden', !hasItems);
      }
      var count = addCanvasCollectionsList ? addCanvasCollectionsList.children.length : 0;
      var copy = count === 1 ? 'Auto-sync collection' : 'Auto-sync collections';
      if (addCanvasAutoSyncLabel) addCanvasAutoSyncLabel.textContent = copy;
      if (addCanvasAutoSyncToggle) addCanvasAutoSyncToggle.setAttribute('aria-label', copy);
    }

    function addCanvasAddCollectionRow() {
      if (!addCanvasCollectionsList) return;
      var name = ADD_CANVAS_COLLECTION_NAMES[addCanvasCollectionNameIndex % ADD_CANVAS_COLLECTION_NAMES.length];
      addCanvasCollectionNameIndex += 1;
      var row = document.createElement('div');
      row.className = 'add-link-collection-item';
      row.setAttribute('role', 'listitem');
      var icon = document.createElement('img');
      icon.src = '../assets/999.svg';
      icon.alt = '';
      icon.width = 25;
      icon.height = 25;
      icon.className = 'add-link-collections-icon';
      icon.setAttribute('aria-hidden', 'true');
      var nameEl = document.createElement('span');
      nameEl.className = 'add-link-collection-item-name';
      nameEl.textContent = name;
      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'add-link-collection-item-remove';
      removeBtn.setAttribute('aria-label', 'Remove ' + name);
      removeBtn.innerHTML = '<img src="../assets/close.svg" alt="" width="25" height="25" />';
      removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        row.remove();
        updateAddCanvasCollectionsVisibility();
      });
      row.appendChild(icon);
      row.appendChild(nameEl);
      row.appendChild(removeBtn);
      addCanvasCollectionsList.insertBefore(row, addCanvasCollectionsList.firstChild);
      updateAddCanvasCollectionsVisibility();
    }

    if (addCanvasCollectionsEmpty) {
      addCanvasCollectionsEmpty.addEventListener('click', function (e) {
        if (e.target === addCanvasCollectionsBtn || addCanvasCollectionsBtn.contains(e.target)) return;
        addCanvasAddCollectionRow();
      });
    }
    if (addCanvasCollectionsBtn) {
      addCanvasCollectionsBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        addCanvasAddCollectionRow();
      });
    }
    if (addCanvasAddCollectionRowBtn) {
      addCanvasAddCollectionRowBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        addCanvasAddCollectionRow();
      });
    }

    if (addCanvasAutoSyncToggle) {
      addCanvasAutoSyncToggle.addEventListener('click', function () {
        var on = this.getAttribute('aria-checked') === 'true';
        this.setAttribute('aria-checked', !on);
      });
    }

    var ADD_CANVAS_COLLABORATOR_NAMES = [
      'Joel', 'David Anastacio', 'Maria Chen', 'Alex Rivera', 'Sam Kim',
      'Jordan Taylor', 'Riley Morgan', 'Casey Lee', 'Jamie Fox', 'Morgan Reed'
    ];
    var ADD_CANVAS_COLLABORATOR_AVATARS = [
      'https://randomuser.me/api/portraits/med/men/32.jpg',
      'https://randomuser.me/api/portraits/med/men/22.jpg',
      'https://randomuser.me/api/portraits/med/women/44.jpg',
      'https://randomuser.me/api/portraits/med/men/67.jpg',
      'https://randomuser.me/api/portraits/med/women/65.jpg',
      'https://randomuser.me/api/portraits/med/men/75.jpg',
      'https://randomuser.me/api/portraits/med/women/33.jpg',
      'https://randomuser.me/api/portraits/med/men/15.jpg',
      'https://randomuser.me/api/portraits/med/women/68.jpg',
      'https://randomuser.me/api/portraits/med/men/81.jpg'
    ];
    var addCanvasCollaboratorNameIndex = 0;

    function updateAddCanvasCollaboratorsVisibility() {
      var hasItems = addCanvasCollaboratorsList && addCanvasCollaboratorsList.children.length > 0;
      if (addCanvasCollaboratorsEmpty) {
        addCanvasCollaboratorsEmpty.style.display = hasItems ? 'none' : '';
        addCanvasCollaboratorsEmpty.setAttribute('aria-hidden', hasItems);
      }
      if (addCanvasCollaboratorsListWrap) {
        addCanvasCollaboratorsListWrap.classList.toggle('add-link-collections-list-wrap--visible', hasItems);
        addCanvasCollaboratorsListWrap.setAttribute('aria-hidden', !hasItems);
      }
    }

    function addCanvasAddCollaboratorRow() {
      if (!addCanvasCollaboratorsList) return;
      var name = ADD_CANVAS_COLLABORATOR_NAMES[addCanvasCollaboratorNameIndex % ADD_CANVAS_COLLABORATOR_NAMES.length];
      addCanvasCollaboratorNameIndex += 1;
      var row = document.createElement('div');
      row.className = 'add-collection-collaborator-item';
      row.setAttribute('role', 'listitem');
      var avatarWrap = document.createElement('div');
      avatarWrap.className = 'add-collection-collaborator-avatar';
      var avatarInner = document.createElement('div');
      avatarInner.className = 'add-collection-collaborator-avatar-inner';
      var avatarImg = document.createElement('img');
      var avatarIndex = (addCanvasCollaboratorNameIndex - 1) % ADD_CANVAS_COLLABORATOR_AVATARS.length;
      if (avatarIndex < 0) avatarIndex += ADD_CANVAS_COLLABORATOR_AVATARS.length;
      avatarImg.src = ADD_CANVAS_COLLABORATOR_AVATARS[avatarIndex];
      avatarImg.alt = '';
      avatarImg.width = 18.18;
      avatarImg.height = 18.18;
      avatarImg.className = 'add-collection-collaborator-avatar-img';
      avatarImg.setAttribute('aria-hidden', 'true');
      avatarInner.appendChild(avatarImg);
      avatarWrap.appendChild(avatarInner);
      var nameEl = document.createElement('span');
      nameEl.className = 'add-collection-collaborator-name';
      nameEl.textContent = name;
      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'add-link-collection-item-remove';
      removeBtn.setAttribute('aria-label', 'Remove ' + name);
      removeBtn.innerHTML = '<img src="../assets/close.svg" alt="" width="25" height="25" />';
      removeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        row.remove();
        updateAddCanvasCollaboratorsVisibility();
      });
      row.appendChild(avatarWrap);
      row.appendChild(nameEl);
      row.appendChild(removeBtn);
      addCanvasCollaboratorsList.insertBefore(row, addCanvasCollaboratorsList.firstChild);
      updateAddCanvasCollaboratorsVisibility();
    }

    if (addCanvasCollaboratorsEmpty) {
      addCanvasCollaboratorsEmpty.addEventListener('click', function (e) {
        if (e.target === addCanvasCollaboratorsBtn || addCanvasCollaboratorsBtn.contains(e.target)) return;
        addCanvasAddCollaboratorRow();
      });
    }
    if (addCanvasCollaboratorsBtn) {
      addCanvasCollaboratorsBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        addCanvasAddCollaboratorRow();
      });
    }
    if (addCanvasAddCollaboratorRowBtn) {
      addCanvasAddCollaboratorRowBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        addCanvasAddCollaboratorRow();
      });
    }
  }

  if (addNoteView) {
    var addNoteClose = document.getElementById('add-note-close');
    var addNoteForm = document.getElementById('add-note-form');
    var addNoteFavoriteToggle = document.getElementById('add-note-favorite-toggle');
    var addNotePrivateToggle = document.getElementById('add-note-private-toggle');
    var addNoteCollectionsEmpty = document.getElementById('add-note-collections-empty');

    if (addNoteClose) addNoteClose.addEventListener('click', closeAddNote);

    if (addNoteForm) {
      addNoteForm.addEventListener('submit', function (e) {
        e.preventDefault();
        closeAddNote();
      });
    }

    var addNoteEditor = document.getElementById('add-note-editor');
    if (addNoteEditor) {
      function growAddNoteEditor() {
        addNoteEditor.style.height = 'auto';
        addNoteEditor.style.height = Math.max(addNoteEditor.scrollHeight, 280) + 'px';
      }
      addNoteEditor.addEventListener('input', growAddNoteEditor);
      addNoteEditor.addEventListener('focus', growAddNoteEditor);
      growAddNoteEditor();
    }

    /* Whole Favorite/Private row clickable: toggle on wrapper click; no handler on button to avoid double-toggle */
    addNoteView.querySelectorAll('.add-note-toggle-inline').forEach(function (row) {
      var toggleBtn = row.querySelector('.add-link-toggle');
      if (!toggleBtn) return;
      row.addEventListener('click', function () {
        var on = toggleBtn.getAttribute('aria-checked') === 'true';
        toggleBtn.setAttribute('aria-checked', !on);
      });
    });

    if (addNoteCollectionsEmpty) {
      addNoteCollectionsEmpty.addEventListener('click', function () {
        /* TODO: open collections picker or add-to-collection flow */
      });
      addNoteCollectionsEmpty.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    }

    document.addEventListener('keydown', function noteEscape(e) {
      if (e.key !== 'Escape' || !addNoteView || !addNoteView.classList.contains('add-note-view--visible')) return;
      e.preventDefault();
      closeAddNote();
    });
  }

  // Action buttons: Link opens add-link page; others placeholder
  document.querySelectorAll('.nav-add-e2-action[data-action]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (this.getAttribute('data-action') === 'import') return;
      var action = this.getAttribute('data-action');
      if (action === 'link') {
        openAddLink();
        return;
      }
      if (action === 'upload') {
        openAddUpload();
        return;
      }
      if (action === 'collection') {
        openAddCollection();
        return;
      }
      if (action === 'canvas') {
        openAddCanvas();
        return;
      }
      if (action === 'write') {
        openAddNote();
        return;
      }
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

  // Library view: import source list items (same layout as pinned collections)
  document.querySelectorAll('.library-pinned-item[data-import]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var source = this.getAttribute('data-import');
      console.log('Import from:', source);
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

  // Sublime search focus: expand to full width, collapse categories and actions, hide feed (search is its own experience)
  if (sublimeSearchInput && sublimeTopBarInner && sublimeView) {
    sublimeSearchInput.addEventListener('focus', function () {
      sublimeTopBarInner.classList.add('sublime-top-bar-inner--search-focused');
      sublimeView.classList.add('sublime-view--search-active');
    });
    sublimeSearchInput.addEventListener('blur', function () {
      sublimeTopBarInner.classList.remove('sublime-top-bar-inner--search-focused');
      sublimeView.classList.remove('sublime-view--search-active');
    });
  }

  // Collapsible library sections (Media types, Pinned collections, Imports) — persist state like Slack/Linear/Cursor
  var LIBRARY_SECTIONS_STORAGE_KEY = 'xx10-library-sections';
  var defaultSectionState = { 'media-types': false, 'pinned': false, 'imports': false };

  function getStoredSectionState() {
    try {
      var raw = localStorage.getItem(LIBRARY_SECTIONS_STORAGE_KEY);
      if (!raw) return defaultSectionState;
      var parsed = JSON.parse(raw);
      return Object.assign({}, defaultSectionState, parsed);
    } catch (e) {
      return defaultSectionState;
    }
  }

  function setStoredSectionState(state) {
    try {
      localStorage.setItem(LIBRARY_SECTIONS_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  function applySectionCollapsed(sectionEl, collapsed) {
    var key = sectionEl.getAttribute('data-section');
    if (!key) return;
    var btn = sectionEl.querySelector('.library-section-header-btn');
    var body = sectionEl.querySelector('.library-section-body');
    if (collapsed) {
      sectionEl.classList.add('library-section--collapsed');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    } else {
      sectionEl.classList.remove('library-section--collapsed');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  }

  document.querySelectorAll('.library-section[data-section]').forEach(function (sectionEl) {
    var key = sectionEl.getAttribute('data-section');
    var state = getStoredSectionState();
    var collapsed = state[key] === true;
    applySectionCollapsed(sectionEl, collapsed);

    var btn = sectionEl.querySelector('.library-section-header-btn');
    if (btn) {
      btn.addEventListener('click', function () {
        var nowCollapsed = sectionEl.classList.toggle('library-section--collapsed');
        btn.setAttribute('aria-expanded', nowCollapsed ? 'false' : 'true');
        var next = getStoredSectionState();
        next[key] = nowCollapsed;
        setStoredSectionState(next);
      });
    }
  });
})();
