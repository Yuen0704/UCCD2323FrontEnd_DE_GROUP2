// Data Store
const newsData = [
    {
        id: 1,
        title: "New update for Nintendo Switch Online members.",
        date: "9 April 2026",
        month: "April",
        category: "Hardware",
        views: 4200,
        likes: 892,
        shares: 124,
        content: "<p>Oh, hey, classic game fans! If you've been looking to create (or recreate) some retro memories, Nintendo Switch Online members can get access to a wide variety of classic goodies. This month's update is sure to hit you right in the nostalgia, bringing back some of the most requested arcade and console staples from the golden era of gaming.</p><p>Three more games were recently added to the lineup! Leading the charge, you control everyone's favourite iconic PAC-MAN! Navigate through neon-lit mazes, gobbling pellets while simultaneously avoiding the devious Ghosts: Blinky, Pinky, Inky, and Clyde. This version includes the newly added global leaderboards, so you can see how your high scores stack up against players worldwide.</p><p>Alongside PAC-MAN, we are also introducing two beloved 16-bit puzzle platformers that will test your reflexes and critical thinking. Both titles support the Nintendo Switch Online app's voice chat feature, making it easier than ever to collaborate with a friend in co-op mode. Furthermore, all games in this update support the newly implemented 'Rewind' feature, allowing you to undo that crucial mistake and keep your run alive.</p><p>If you don't have a membership, you can start a free 7-day Nintendo Switch Online trial right from the eShop. Climb carefully, chomp those fruit bonuses, and enjoy a trip down memory lane!</p>",
        image: "News Images/nintendo_classics_2604bnr.png" 
    },
    {
        id: 2,
        title: "Pokémon Champions is coming to Nintendo Switch on 8 April.",
        date: "6 April 2026",
        month: "April",
        category: "Games",
        views: 12500,
        likes: 3200,
        shares: 542,
        content: "<p>A new era of Pokémon battles arrives! Trainers from all over the world can soon step into the ultimate arena and prove they have what it takes to be the very best. <em>Pokémon Champions</em> shifts the focus entirely onto the thrill of competitive battling, offering a robust, visually stunning stadium experience built specifically for the Nintendo Switch.</p><p>Assemble your dream team of Pokémon and take on legendary Gym Leaders, Elite Four members, and iconic Champions from across the history of the Pokémon universe. From Kanto's fierce Lance to Galar's unbeatable Leon, every major rival is fully voiced and brings their signature, hyper-optimized teams to the battlefield.</p><p>The game introduces the brand-new 'World Tournament Facility,' a massive hub where players can customize their trainer avatars, purchase rare held items, and engage in deeply tactical 3v3 and 6v6 formats. The new matchmaking system ensures you're always paired with opponents of similar skill levels, whether you are a casual fan looking for fun or a hardcore competitive player grinding the Ranked Ladder.</p><p>With fully destructible battlefield environments, newly animated dynamic camera angles, and an orchestral soundtrack remixing the greatest battle themes in franchise history, this is the ultimate celebration of Pokémon combat.</p>",
        image: "News Images/PokeÌ_mon_Champions_bnr.png",
        video: "News Video/Pokémon Champions – Overview Trailer – Nintendo Switch - Nintendo of America (1080p).mp4"
    },
    {
        id: 3,
        title: "What's New on Nintendo eShop - 03/04/2026 Update",
        date: "3 April 2026",
        month: "April",
        category: "Games",
        views: 2100,
        likes: 154,
        shares: 12,
        content: "<p>Looking for something new to play? Check out this week's new releases for Nintendo Switch 2 and Nintendo Switch. To learn more or to buy a game, just head over to the Nintendo eShop directly from your console's home menu.</p><p>Highlights this week include several highly anticipated indie titles and major publisher releases guaranteed to keep you entertained all weekend long. Strategy fans can finally get their hands on <em>Stellar Tactics: Resurgence</em>, which brings deep, grid-based sci-fi combat and a sweeping narrative spanning dozens of star systems.</p><p>For those looking for a more relaxing experience, <em>Cozy Café Manager</em> allows you to design, build, and run your very own bustling coffee shop. You'll need to source local ingredients, discover secret brewing recipes, and keep your quirky neighborhood regulars happy.</p><p>Also starting today is the 'Spring Awakening Sale.' For a limited time, you can save up to 50% on select multiplayer and co-op games. It’s the perfect opportunity to stock up on digital titles for your next family game night. Check the ‘Great Deals’ tab on the eShop for the full list of discounted software!</p>",
        image: "News Images/nintendo_eshop.jpg"
    },
    {
        id: 4,
        title: "A free demo for Tomodachi Life: Living the Dream is out now!",
        date: "1 April 2026",
        month: "April",
        category: "Games",
        views: 8900,
        likes: 2100,
        shares: 401,
        content: "<p>Your Mii characters are about to embark on their wildest adventure yet. A free demo for <em>Tomodachi Life: Living the Dream</em> is available to download right now on the Nintendo eShop, giving you an early taste of the bizarre and wonderful island life that awaits.</p><p>Create your lookalike, assign them a unique personality using the newly revamped personality compass, and watch as bizarre and hilarious situations unfold on your very own island. The demo allows you to create up to five Mii characters, set their catchphrases, and even try out the new voice-synthesis engine that makes your Miis sound more expressive than ever before.</p><p>In this early look, you can explore the Central Plaza, feed your Miis some wacky food combinations to discover their all-time favorites, and witness a few of the brand-new interactive dream sequences. Will your Mii become a pop star, or will they have a nightmare about being chased by a giant slice of pizza?</p><p>The best part? All of your island progress, including the Miis you create and the relationships they begin to form, will transfer seamlessly to the full version of the game when it launches later this month. Don't wait—start building your quirky community today!</p>",
        image: "News Images/topics_tomodachilife_en.png"
    },
    {
        id: 5,
        title: "What's New on Nintendo eShop - 26/03/2026 Update",
        date: "26 March 2026",
        month: "March",
        category: "Games",
        views: 1800,
        likes: 132,
        shares: 8,
        content: "<p>The digital storefront has been updated once again! Discover the latest titles hitting the Nintendo Switch ecosystem this week, featuring a diverse mix of heart-pounding action games, mind-bending puzzles, and narrative-driven adventures.</p><p>Leading the pack this week is the long-awaited definitive edition of <em>Crimson Skies: Overdrive</em>, a high-octane aerial dogfighting game that boasts a massive 32-player online mode and deeply customizable aircraft. We are also thrilled to welcome the critically acclaimed visual novel <em>Whispers in the Snow</em>, a chilling mystery that will keep you guessing until the very last chapter.</p><p>Don't miss out on special introductory launch discounts available on select software exclusively through the Nintendo eShop. Members who purchase designated launch-window titles will also receive double My Nintendo Gold Points, which can be used toward your next digital purchase.</p><p>Finally, we have added a new 'Retro Throwback' section to the eShop, making it easier than ever to browse and purchase classic arcade ports and remastered collections. Be sure to check it out and see if your childhood favorites have made the jump to the Switch!</p>",
        image: "News Images/nintendo_eshop.jpg" 
    },
    {
        id: 6,
        title: "A quick overview of Resident Evil Requiem, coming to Nintendo Switch 2",
        date: "27 February 2026",
        month: "February",
        category: "Games",
        views: 15200,
        likes: 4500,
        shares: 890,
        content: "<p>A new era of survival horror arrives with <em>Resident Evil Requiem</em>, the latest and most immersive entry yet in the iconic Resident Evil series. Built from the ground up to utilize the enhanced processing power of the Nintendo Switch 2, the game promises unparalleled atmospheric lighting, terrifyingly detailed enemy models, and seamless load times.</p><p>Experience terrifying survival horror with FBI analyst Grace Ashcroft, a brand new protagonist thrust into a nightmarish scenario in a remote, fog-drenched European mountain village. Lacking formal combat training, Grace's gameplay focuses heavily on stealth, puzzle-solving, and utilizing environmental traps to evade the relentless monstrous locals.</p><p>Dive into pulse-pounding action with legendary agent Leon S. Kennedy, whose concurrent mission brings him to the very same village. Leon's segments are heavily action-oriented, featuring the tight, over-the-shoulder gunplay fans have come to love, along with a newly revamped close-quarters parry system.</p><p>Both of their journeys and unique gameplay styles intertwine into a heart-stopping, emotional experience. The choices you make as one character will directly impact the environments and resources available to the other, making inventory management and strategic planning more crucial than ever.</p>",
        image: "News Images/evil_bnr.jpg" 
    },
    {
        id: 7,
        title: "Tomodachi Life: Living the Dream page is now open.",
        date: "1 April 2026",
        month: "April",
        category: "Events",
        views: 3400,
        likes: 450,
        shares: 34,
        content: "<p>The official webpage for <em>Tomodachi Life: Living the Dream</em> has officially launched! Fans can now visit the site to learn more about the upcoming features, mini-games, and extensive customization options heading to the Nintendo Switch.</p><p>The website features an interactive 'Mii Maker' preview, allowing users to play around with some of the new hairstyles, outfits, and accessories directly in their web browser. You can even generate a unique QR code from the website to scan directly into the game on launch day, giving your Mii a head start with an exclusive designer outfit.</p><p>Additionally, the site includes a comprehensive developer blog that details the evolution of the game's relationship mechanics. The developers explain how Miis can now form more complex social webs, including best friendships, rivalries, and even secret crushes that require you, as the player, to play matchmaker.</p><p>Stay tuned for more updates as we approach the official launch date! We will be updating the webpage weekly with new short gameplay clips, character spotlight videos, and downloadable mobile wallpapers.</p>",
        image: "News Images/tomodachi life.jpg" 
    },
    {
        id: 8,
        title: "Nintendo Direct - January 2026 Recap",
        date: "15 January 2026",
        month: "January",
        category: "Hardware",
        views: 25600,
        likes: 8900,
        shares: 1200,
        content: "<p>Did you miss the first Nintendo Direct of the year? Don't worry, we've got you covered with a comprehensive recap of all the major announcements, stunning trailers, and surprise shadow-drops from our thrilling 45-minute presentation.</p><p>The show kicked off with a massive bang, revealing a first look at the highly anticipated 3D platformer, <em>Donkey Kong Country: Canopy Chaos</em>, featuring fully cooperative 4-player multiplayer and stunning jungle environments. We also got deep dives into upcoming RPGs, highlighting the intricate battle systems and sprawling open worlds that fans can look forward to exploring.</p><p>Of course, the highlight of the event was the hardware tease segment. While keeping exact details closely guarded, we provided a tantalizing glimpse at the ergonomic redesign of the next-generation controllers, promising enhanced haptic feedback and incredibly precise motion tracking.</p><p>From hardware teases to massive software reveals, 2026 is shaping up to be an incredible year for Nintendo fans globally. You can watch the full Video-on-Demand (VOD) on our official YouTube channel, or visit the eShop to download the titles that were released immediately following the broadcast.</p>",
        image: "News Images/nintendo direct.jpg"
    },
    {
        id: 9,
        title: "The Super Mario Galaxy Movie which will be released in April 2026",
        date: "10 April 2026",
        month: "April",
        category: "Movies",
        views: 85400,
        likes: 14200,
        shares: 8900,
        content: "<p>The official trailer for <em>The Super Mario Galaxy Movie</em>, the new animated film based on the breathtaking world of Super Mario Bros., premiered during a special Nintendo Direct presentation. Following the massive success of the first film, this sequel pushes the boundaries of animation and takes our heroes to the literal stars.</p><p>The film will be released worldwide by Universal Pictures in April 2026. Produced by Illumination in close partnership with Nintendo, the story follows Mario and Luigi as they team up with Rosalina, the enigmatic protector of the cosmos. Together, they must stop a newly empowered Bowser, who has stolen the universe's Grand Stars to power a colossal, planet-sized airship.</p><p>Check out The Super Mario Galaxy Movie Direct below to see Mario, Luigi, and Rosalina embark on an interstellar journey spanning the cosmos! The trailer showcases dazzling recreations of iconic locations like the Comet Observatory and the Honeyhive Galaxy, brought to life with incredible visual fidelity and a soaring orchestral soundtrack.</p><p>Fans can also look forward to an all-star returning voice cast, alongside some surprise new additions playing fan-favorite cosmic characters. We can't wait for you to experience this gravity-defying adventure in theaters!</p><p class='text-xs text-gray-400 mt-4'>© 2026 Nintendo and Universal Studios. All Rights Reserved.</p>",
        image: "News Images/mario galaxy.jpg"
    },
    {
        id: 10,
        title: "Metroid Prime 4: Beyond - Extended Gameplay Showcase Announced",
        date: "12 April 2026",
        month: "April",
        category: "Events",
        views: 45200,
        likes: 9300,
        shares: 3100,
        content: "<p>Bounty hunter Samus Aran's next mission is almost here, and the galaxy is bracing for impact. Join us on April 18th for an exclusive 20-minute gameplay showcase of <em>Metroid Prime 4: Beyond</em>, diving deep into the new mechanics, breathtaking alien environments, and fearsome new enemies.</p><p>Developed by the masterful team at Retro Studios, this highly anticipated sequel promises to push the boundaries of first-person exploration. The showcase will provide an uninterrupted look at the opening segment of the game, highlighting the seamless transition between intense visceral combat and methodical puzzle-solving.</p><p>We will also be detailing the newly upgraded 'Omni-Visor' mechanic, which allows Samus to analyze temporal distortions in her environment to solve complex dimensional puzzles and uncover the hidden history of a forgotten civilization. Fans of the franchise's deep lore won't want to miss these revelations.</p><p>The presentation will be broadcast simultaneously on our official YouTube and Twitch channels at 7:00 AM PT / 10:00 AM ET. Mark your calendars, power up your arm cannons, and prepare to step back into the suit.</p>",
        image: "News Images/metroid.jpg"
    },
    {
        id: 11,
        title: "Animal Crossing: City Breeze Spring Update arrives late April!",
        date: "14 April 2026",
        month: "April",
        category: "Games",
        views: 38900,
        likes: 11200,
        shares: 2400,
        content: "<p>Get ready to spruce up your metropolis! The highly anticipated Spring Update for <em>Animal Crossing: City Breeze</em> lands on April 28th. As the snow melts and the cherry blossoms begin to bloom across the urban landscape, it's the perfect time to revitalize your neighborhood and welcome some new faces.</p><p>This free update brings back beloved cherry blossom DIY recipes, introducing new high-rise apartment customization options such as panoramic balcony views and modular loft interiors. We are also thrilled to welcome Lief's expanded rooftop garden center, where you can purchase exotic seeds, fertilizer, and decorative topiary to turn your concrete jungle green.</p><p>In addition to new seasonal items, this update includes several highly requested quality-of-life improvements. Players will now be able to batch-craft items at workbenches, skip certain repetitive dialogue options with city vendors, and expand their storage units by an additional 1,000 slots!</p><p>Don't forget to check your in-game mailbox on update day for a special seasonal gift from Nintendo—a decorative indoor cherry blossom bonsai! Get your urban planning hats on and prepare for a vibrant spring season.</p>",
        image: "News Images/animal crossing.jpg"
    },
    {
        id: 12,
        title: "Nintendo Switch 2: Hands-on Global Tour Locations Revealed",
        date: "2 April 2026",
        month: "April",
        category: "Hardware",
        views: 112000,
        likes: 25400,
        shares: 15600,
        content: "<p>Want to be among the first to experience the next generation of Nintendo gaming? The Nintendo Switch 2 Global Hands-on Tour is officially kicking off this May, bringing our revolutionary new console directly to the fans before its worldwide release!</p><p>We will be setting up massive interactive demo stations in major cities across North America, Europe, and Asia. These immersive popup events will allow attendees to test out the console's incredible new display technology, experience the refined controller ergonomics, and play exclusive demos of our major launch window titles.</p><p>The tour will feature playable builds of highly anticipated titles, including the next 3D Mario adventure and the stunningly realistic new entry in the Mario Kart franchise. Attendees will also have the opportunity to purchase exclusive tour merchandise and take photos with life-sized statues of their favorite Nintendo characters.</p><p>Check out our official events portal to secure your free ticket and time slot. Please note that a valid Nintendo Account is required to register. Spaces are extremely limited and will be distributed on a first-come, first-served basis, so act fast!</p>",
        image: "News Images/handson events.jpg"
    },
    {
        id: 13,
        title: "The Legend of Zelda: Echoes of Wisdom - DLC Pack 1 details",
        date: "20 March 2026",
        month: "March",
        category: "Games",
        views: 29000,
        likes: 6700,
        shares: 1100,
        content: "<p>Expand Princess Zelda's grand adventure with the 'Trials of the Goddess' DLC pack, launching next week! This first wave of downloadable content promises to test everything you've learned about the game's unique duplication mechanics and creative puzzle-solving systems.</p><p>This first wave of downloadable content introduces a challenging new 'Illusionary Boss Rush' mode. Face off against phantom versions of the game's most difficult bosses, strung together in grueling gauntlets that limit your available health and magic resources. Conquering these trials will reward you with exclusive permanent heart containers and stamina upgrades.</p><p>Additionally, players will be able to discover three powerful new echoes hidden across the map, including the 'Gale Propeller' which allows for sustained vertical lift, and the 'Mirror Shield Reflex,' an echo that bounces enemy projectiles back with homing accuracy. You will also unlock the 'Royal Tactician's Outfit' for Zelda, which passively increases movement speed while carrying heavy objects.</p><p>The Expansion Pass, which includes access to both this DLC pack and the upcoming story expansion 'Shadows of Hyrule' releasing later this year, is available for purchase now on the Nintendo eShop.</p>",
        image: "News Images/zelda.jpg"
    }
];

// App State
let state = {
    category: 'All News',
    search: '',
    month: 'All',
    currentPage: 1,
    itemsPerPage: 8,
    currentArticleId: null,
    carouselIndex: 0,
    recentViews: [],
    userLikes: {}
};

// DOM Elements setup
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const el = {
    homeView: $('home-view'),
    articleView: $('article-view'),
    grid: $('news-grid'),
    emptyState: $('empty-state'),
    categoryBtns: $$('.btn-category'),
    searchInput: $('searchInput'),
    monthSelect: $('monthSelect'),
    moreNewsGrid: $('more-news-grid'),
    pagContainer: $('pagination-container'),
    recentContainer: $('recent-view-container')
};

// Utility Functions
function formatNumber(n) {
    return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : n.toString();
}

function calculateReadTime(htmlContent) {
    const words = htmlContent.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200)) + ' min read';
}

let toastTimeout;
function showToast(message) {
    const t = $('toast');
    t.textContent = message;
    t.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => t.classList.remove('show'), 2200);
}

// Ticker Logic
function buildTicker(elementId, headlines) {
    const container = $(elementId);
    const content = [...headlines, ...headlines].map(h => `
        <span class="ticker-item">
            ${h} <i data-lucide="star" style="width:14px;height:14px;color:var(--nin-red);fill:currentColor;"></i>
        </span>
    `).join('');
    container.innerHTML = content;
}

// View Navigation
function showHome() {
    el.articleView.classList.add('hidden');
    el.homeView.classList.remove('hidden');
    $('reading-progress').style.display = 'none';
    $('nav-breadcrumb').classList.add('hidden');
    
    state.currentArticleId = null;
    updateMobileNav('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showArticle(id) {
    const article = newsData.find(x => x.id === id);
    if (!article) return;
    
    state.currentArticleId = id;
    addRecentView(id);
    buildCarousel(article);
    
    // Populate Data
    $('article-date').textContent = article.date;
    $('article-category').textContent = article.category;
    $('article-title').textContent = article.title;
    $('article-content').innerHTML = article.content;
    $('article-readtime').textContent = calculateReadTime(article.content);
    $('article-views').textContent = formatNumber(article.views);
    $('article-likes').textContent = formatNumber(article.likes);
    $('article-shares').textContent = formatNumber(article.shares);
    $('nav-article-title').textContent = article.title;
    
    $('nav-breadcrumb').classList.remove('hidden');
    updateEngagementUI(id);
    updateArticleTicker(article);
    updatePrevNextButtons();
    
    // Render More News
    el.moreNewsGrid.innerHTML = '';
    newsData.filter(x => x.id !== id).forEach(item => {
        const card = document.createElement('div');
        card.className = 'recent-card card';
        card.style.width = '180px';
        card.onclick = () => showArticle(item.id);
        
        const imgContent = item.image 
            ? `<img src="${encodeURI(item.image)}" alt="${item.title}" onerror="this.style.display='none'">` 
            : `<span class="card-img-placeholder">No Image</span>`;

        card.innerHTML = `
            <div class="card-img">${imgContent}</div>
            <div class="card-body">
                <div class="card-meta">${item.date}</div>
                <h4 class="card-title">${item.title}</h4>
            </div>
        `;
        el.moreNewsGrid.appendChild(card);
    });
    
    // Switch View
    el.homeView.classList.add('hidden');
    el.articleView.classList.remove('hidden');
    $('reading-progress').style.display = 'block';
    $('reading-progress').style.width = '0%';
    
    updateMobileNav('article');
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (window.lucide) lucide.createIcons();
}

// Carousel Logic
let carouselImages = [];
function buildCarousel(article) {
    carouselImages = [article.image];
    state.carouselIndex = 0;
    const track = $('carousel-track');
    
    track.style.transform = 'translateX(0%)';
    track.innerHTML = carouselImages.map(img => {
        const imgContent = img 
            ? `<img src="${encodeURI(img)}" alt="Article Image" onerror="this.style.display='none'">` 
            : `<span class="carousel-placeholder">No Image Available</span>`;
            
        return `
        <div class="carousel-slide" onclick="openLightbox('${img}')">
            ${imgContent}
        </div>
        `;
    }).join('');
    
    $('carousel-dots').innerHTML = ''; // Single image, no dots needed
    
    // Hide buttons if only 1 image
    $$('.carousel-btn').forEach(btn => btn.style.display = 'none');
}

// Article Navigation & Engagement
function updateArticleTicker(article) {
    const headlines = [article.title.toUpperCase(), ...newsData.filter(x => x.id !== article.id).slice(0, 3).map(x => x.title.toUpperCase())];
    buildTicker('article-ticker', headlines);
    if (window.lucide) lucide.createIcons();
}

function navigateArticle(direction) {
    const ids = newsData.map(a => a.id);
    const idx = ids.indexOf(state.currentArticleId);
    if (idx === -1) return;
    
    let nextIdx = direction === 'prev' 
        ? (idx > 0 ? idx - 1 : ids.length - 1) 
        : (idx < ids.length - 1 ? idx + 1 : 0);
        
    showArticle(ids[nextIdx]);
}

function updatePrevNextButtons() {
    const ids = newsData.map(a => a.id);
    const idx = ids.indexOf(state.currentArticleId);
    $('btn-prev-article').innerHTML = `<i data-lucide="arrow-left" style="width:16px;height:16px;"></i> ${idx <= 0 ? 'Last' : 'Previous'}`;
    $('btn-next-article').innerHTML = `${idx >= ids.length - 1 ? 'First' : 'Next'} <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>`;
    if (window.lucide) lucide.createIcons();
}

function toggleLike() {
    const id = state.currentArticleId;
    const article = newsData.find(x => x.id === id);
    if (!article) return;
    
    if (state.userLikes[id] === 'like') {
        state.userLikes[id] = null;
        article.likes--;
        showToast('Like removed');
    } else {
        if (state.userLikes[id] === 'dislike') article.likes++; // remove dislike penalty
        state.userLikes[id] = 'like';
        article.likes++;
        showToast('Liked!');
    }
    $('article-likes').textContent = formatNumber(article.likes);
    updateEngagementUI(id);
}

function toggleDislike() {
    const id = state.currentArticleId;
    const article = newsData.find(x => x.id === id);
    if (!article) return;
    
    if (state.userLikes[id] === 'dislike') {
        state.userLikes[id] = null;
        showToast('Dislike removed');
    } else {
        if (state.userLikes[id] === 'like') article.likes--;
        state.userLikes[id] = 'dislike';
        showToast('Feedback noted');
    }
    $('article-likes').textContent = formatNumber(article.likes);
    updateEngagementUI(id);
}

function shareArticle() {
    const article = newsData.find(x => x.id === state.currentArticleId);
    if(!article) return;
    article.shares++;
    $('article-shares').textContent = formatNumber(article.shares);
    showToast('Link copied!');
}

function updateEngagementUI(id) {
    $('btn-like').classList.toggle('like-active', state.userLikes[id] === 'like');
    $('btn-dislike').classList.toggle('dislike-active', state.userLikes[id] === 'dislike');
}

function scrollMoreNews(direction) {
    el.moreNewsGrid.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
}

// Recent Views
function addRecentView(id) {
    state.recentViews = state.recentViews.filter(x => x !== id);
    state.recentViews.unshift(id);
    if (state.recentViews.length > 6) state.recentViews.pop();
    renderRecentViews();
}

function renderRecentViews() {
    if (!state.recentViews.length) {
        el.recentContainer.innerHTML = `<div style="text-align:center;width:100%;color:var(--text-light);font-size:0.75rem;font-weight:800;text-transform:uppercase;">Your recently viewed articles appear here</div>`;
        return;
    }
    el.recentContainer.innerHTML = state.recentViews.map(id => {
        const article = newsData.find(x => x.id === id);
        if (!article) return '';
        
        const imgContent = article.image 
            ? `<img src="${encodeURI(article.image)}" alt="${article.title}" onerror="this.style.display='none'">` 
            : `<span class="card-img-placeholder">No Image</span>`;

        return `
            <div class="recent-card card" onclick="showArticle(${article.id})">
                <div class="card-img">${imgContent}</div>
                <h4>${article.title}</h4>
            </div>
        `;
    }).join('');
}

// Filtering & Rendering Grid
function getFilteredNews() {
    return newsData.filter(article => {
        const matchCategory = state.category === 'All News' || article.category === state.category;
        const matchMonth = state.month === 'All' || article.month === state.month;
        const matchSearch = article.title.toLowerCase().includes(state.search.toLowerCase());
        return matchCategory && matchMonth && matchSearch;
    });
}

function filterArticles() {
    state.currentPage = 1;
    renderCards(getFilteredNews());
}

function resetFilters() {
    state.category = 'All News';
    state.search = '';
    state.month = 'All';
    el.searchInput.value = '';
    el.monthSelect.value = 'All';
    updateCategoryUI();
    filterArticles();
}

function renderCards(articles) {
    el.grid.innerHTML = '';
    $('results-count').textContent = `${articles.length} article${articles.length !== 1 ? 's' : ''} found`;
    
    if (!articles.length) {
        el.grid.classList.add('hidden');
        el.emptyState.classList.remove('hidden');
        el.pagContainer.innerHTML = '';
        return;
    }
    
    el.grid.classList.remove('hidden');
    el.emptyState.classList.add('hidden');
    
    const totalPages = Math.ceil(articles.length / state.itemsPerPage);
    if (state.currentPage > totalPages) state.currentPage = 1;
    
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const pageArticles = articles.slice(startIndex, startIndex + state.itemsPerPage);
    
    pageArticles.forEach((article, index) => {
        const card = document.createElement('article');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.06}s`;
        card.onclick = () => showArticle(article.id);
        
        // Render image if it exists, otherwise leave empty for the grey background
        const imgContent = article.image 
            ? `<img src="${encodeURI(article.image)}" alt="${article.title}" onerror="this.style.display='none'">` 
            : `<span class="card-img-placeholder">No Image</span>`;

        card.innerHTML = `
            <div class="card-img">
                ${imgContent}
                <div class="card-category-badge">${article.category}</div>
            </div>
            <div class="card-body">
                <div class="card-meta">
                    <span>${article.date}</span>
                    <span class="card-views"><i data-lucide="eye" style="width:12px;height:12px;"></i> ${formatNumber(article.views)}</span>
                </div>
                <h3 class="card-title">${article.title}</h3>
            </div>
        `;
        el.grid.appendChild(card);
    });
    
    renderPagination(articles.length, totalPages);
    if (window.lucide) lucide.createIcons();
}

function renderPagination(totalItems, totalPages) {
    if (totalPages <= 1) {
        el.pagContainer.innerHTML = '';
        return;
    }
    
    let html = `
        <button onclick="goToPage(${state.currentPage - 1})" class="page-btn" ${state.currentPage === 1 ? 'disabled' : ''}>
            <i data-lucide="chevron-left" style="width:16px;height:16px;"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === state.currentPage ? 'active' : '';
        html += `<button onclick="goToPage(${i})" class="page-btn ${activeClass}">${i}</button>`;
    }
    
    html += `
        <button onclick="goToPage(${state.currentPage + 1})" class="page-btn" ${state.currentPage === totalPages ? 'disabled' : ''}>
            <i data-lucide="chevron-right" style="width:16px;height:16px;"></i>
        </button>
    `;
    
    el.pagContainer.innerHTML = html;
}

function goToPage(page) {
    const filtered = getFilteredNews();
    const totalPages = Math.ceil(filtered.length / state.itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    state.currentPage = page;
    renderCards(filtered);
    el.grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updateCategoryUI() {
    el.categoryBtns.forEach(btn => {
        if (btn.dataset.category === state.category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Mobile Nav & Utils
function updateMobileNav(view) {
    $$('.mobile-nav-item').forEach(e => e.classList.remove('active'));
    if (view === 'home') $('mnav-home').classList.add('active');
}

function focusSearch() {
    showHome();
    setTimeout(() => {
        el.searchInput.focus();
        el.searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 400);
}

function scrollToRecent() {
    showHome();
    setTimeout(() => {
        $('recent-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        $('mnav-recent').classList.add('active');
        $('mnav-home').classList.remove('active');
    }, 100);
}

// Lightbox
function openLightbox(srcText) {
    if (!srcText) return; // Prevent opening empty lightbox
    
    const modal = $('image-modal');
    const imgPlaceholder = $('lightbox-img');
    
    // Inject actual image tag
    imgPlaceholder.innerHTML = `<img src="${encodeURI(srcText)}" alt="Expanded view">`;
    
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('open'));
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const modal = $('image-modal');
    modal.classList.remove('open');
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// Event Listeners
window.addEventListener('scroll', () => {
    $('fab-top').classList.toggle('visible', window.scrollY > 500);
    
    if (state.currentArticleId) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPct = docHeight > 0 ? Math.min(100, (window.scrollY / docHeight) * 100) : 0;
        $('reading-progress').style.width = scrollPct + '%';
    }
}, { passive: true });

el.categoryBtns.forEach(btn => btn.addEventListener('click', e => {
    state.category = e.target.dataset.category;
    updateCategoryUI();
    filterArticles();
}));

el.searchInput.addEventListener('input', e => {
    state.search = e.target.value;
    filterArticles();
});

el.monthSelect.addEventListener('change', e => {
    state.month = e.target.value;
    filterArticles();
});

document.addEventListener('keydown', e => {
    if (state.currentArticleId) {
        if (e.key === 'ArrowLeft') navigateArticle('prev');
        if (e.key === 'ArrowRight') navigateArticle('next');
        if (e.key === 'Escape') {
            const m = $('image-modal');
            m.classList.contains('open') ? closeLightbox() : showHome();
        }
    } else if (e.key === 'Escape') closeLightbox();
});

$('hero-section').onclick = () => showArticle(newsData[0].id);

// Initialization
buildTicker('home-ticker', newsData.slice(0, 4).map(a => a.title.toUpperCase()));
renderCards(newsData);
renderRecentViews();
if (window.lucide) lucide.createIcons();