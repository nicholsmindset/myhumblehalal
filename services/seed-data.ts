import { Business, Event, UserReview, User, BlogPost, Category, Region } from '../types';

// Shared placeholder images (google LH3 hosted, won't expire)
const IMG = "https://lh3.googleusercontent.com/aida-public/AB6AXuDup71s2VVfXxtDvX_tz2dgI1cgXEzdCfWqmcB5OUDCf5XiuS_D65zLm2CV6eIFRXtNX0ARqRTs_qD1E43ZVL06qZikpqxfH_iAyT-hO3kfygelIZJHVUTFYgSeeD7CtHFL5NJSs5KsgLEMlqGIf64FX_m42lWnfvg1MjqTcfRVXp4UrWYwAMd-AbGeyOUOarN2uAkwI6nIDv_C1fBKUOI0X3BAogA4ctzDA2TKgQZU2bzHPVriPiSDRu59NupzwPR2EOUoHACdtvg";

export const SEED_BUSINESSES: Business[] = [
    // ── Food & Beverage ──
    {
        id: "biz_1", name: "The Coconut Club", category: Category.FOOD,
        address: "269 Beach Rd, Singapore 199546", region: Region.CENTRAL,
        rating: 4.9, reviewCount: 128, imageUrl: IMG,
        description: "Signature Nasi Lemak and authentic Malay cuisine in a colonial-style setting. Known for their fragrant coconut rice cooked with premium ingredients.",
        openingHours: "Mon-Sun 11:00 AM - 9:00 PM", phone: "+65 6298 1827",
        website: "https://thecoconutclub.sg", isVerified: true, isFeatured: true,
        status: 'Approved', submissionDate: '2024-01-15', tags: ['nasi lemak', 'malay', 'coconut rice'],
        priceRange: '$$', lat: 1.3025, lng: 103.8600,
    },
    {
        id: "biz_2", name: "Hjh Maimunah", category: Category.FOOD,
        address: "11 Jalan Pisang, Singapore 199078", region: Region.CENTRAL,
        rating: 4.5, reviewCount: 84, imageUrl: IMG,
        description: "Award-winning traditional Malay restaurant serving generous nasi padang with an array of dishes from rendang to sayur lodeh.",
        openingHours: "Mon-Sat 7:00 AM - 8:00 PM", phone: "+65 6297 4294",
        isVerified: true, isFeatured: true,
        status: 'Approved', submissionDate: '2024-01-20', tags: ['nasi padang', 'rendang', 'traditional'],
        priceRange: '$', lat: 1.3021, lng: 103.8576,
    },
    {
        id: "biz_3", name: "Zamzam Restaurant", category: Category.FOOD,
        address: "697 North Bridge Rd, Singapore 198675", region: Region.CENTRAL,
        rating: 4.3, reviewCount: 210, imageUrl: IMG,
        description: "Legendary murtabak spot since 1908. Their crispy, meat-stuffed murtabak with curry sauce is a must-try institution.",
        openingHours: "Daily 7:00 AM - 11:00 PM", phone: "+65 6298 6320",
        isVerified: true, isFeatured: true,
        status: 'Approved', submissionDate: '2024-02-01', tags: ['murtabak', 'indian muslim', 'heritage'],
        priceRange: '$', lat: 1.3024, lng: 103.8588,
    },
    {
        id: "biz_4", name: "Rumah Makan Minang", category: Category.FOOD,
        address: "18 Kandahar Street, Singapore 198884", region: Region.CENTRAL,
        rating: 4.6, reviewCount: 62, imageUrl: IMG,
        description: "Authentic Minangkabau cuisine from West Sumatra. Famous for rich beef rendang and gulai dishes.",
        openingHours: "Tue-Sun 10:00 AM - 9:00 PM", phone: "+65 6294 4607",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-02-15', tags: ['minang', 'rendang', 'padang'],
        priceRange: '$', lat: 1.3018, lng: 103.8590,
    },
    {
        id: "biz_5", name: "Saffron's Kitchen", category: Category.FOOD,
        address: "52 Changi Business Park Central 2, Singapore 486066", region: Region.EAST,
        rating: 4.4, reviewCount: 47, imageUrl: IMG,
        description: "Modern halal fusion dining experience combining Malay, Middle Eastern, and Western flavors in a stylish setting.",
        openingHours: "Mon-Sat 11:30 AM - 10:00 PM", phone: "+65 6787 1234",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-03-01', tags: ['fusion', 'modern', 'middle eastern'],
        priceRange: '$$', lat: 1.3341, lng: 103.9640,
    },
    {
        id: "biz_6", name: "Al-Azhar Eating Restaurant", category: Category.FOOD,
        address: "11 Eunos Link, Singapore 409564", region: Region.EAST,
        rating: 4.7, reviewCount: 156, imageUrl: IMG,
        description: "Famous for their legendary fried chicken and nasi briyani. A Malay food institution in the East.",
        openingHours: "Daily 6:00 AM - 12:00 AM", phone: "+65 6746 3878",
        isVerified: true, isFeatured: true,
        status: 'Approved', submissionDate: '2024-03-10', tags: ['nasi briyani', 'fried chicken', 'malay'],
        priceRange: '$', lat: 1.3193, lng: 103.9027,
    },
    {
        id: "biz_7", name: "Pu3 Restaurant", category: Category.FOOD,
        address: "1 Jurong West Central 2, #04-08 Jurong Point", region: Region.WEST,
        rating: 4.1, reviewCount: 33, imageUrl: IMG,
        description: "Contemporary Western-Asian halal dining with steaks, pasta, and local favorites. Great for family outings.",
        openingHours: "Daily 11:00 AM - 10:00 PM", phone: "+65 6316 2878",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-03-20', tags: ['western', 'steak', 'family'],
        priceRange: '$$', lat: 1.3398, lng: 103.7069,
    },
    {
        id: "biz_8", name: "Carousel @ Royal Plaza", category: Category.FOOD,
        address: "25 Scotts Road, Royal Plaza on Scotts", region: Region.CENTRAL,
        rating: 4.8, reviewCount: 89, imageUrl: IMG,
        description: "Premium halal buffet restaurant with international cuisine. Crab and sashimi are highlights.",
        openingHours: "Daily 12:00 PM - 2:30 PM, 6:30 PM - 10:00 PM", phone: "+65 6589 7799",
        isVerified: true, isFeatured: true,
        status: 'Approved', submissionDate: '2024-04-01', tags: ['buffet', 'seafood', 'fine dining'],
        priceRange: '$$$', lat: 1.3076, lng: 103.8365,
    },

    // ── Retail & Shopping ──
    {
        id: "biz_9", name: "Wardah Books", category: Category.RETAIL,
        address: "58 Bussorah St, Singapore 199474", region: Region.CENTRAL,
        rating: 4.6, reviewCount: 38, imageUrl: IMG,
        description: "Curated Islamic bookstore in the heart of Kampong Glam. Stocks religious texts, contemporary Muslim literature, and gift items.",
        openingHours: "Mon-Sat 10:00 AM - 7:00 PM", phone: "+65 6297 1232",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-04-05', tags: ['books', 'islamic', 'gifts'],
        priceRange: '$', lat: 1.3015, lng: 103.8590,
    },
    {
        id: "biz_10", name: "Noura Modest Fashion", category: Category.RETAIL,
        address: "200 Victoria St, #02-15 Bugis Junction", region: Region.CENTRAL,
        rating: 4.3, reviewCount: 27, imageUrl: IMG,
        description: "Trendy modest fashion boutique offering hijabs, abayas, and contemporary Muslim wear for women.",
        openingHours: "Daily 10:00 AM - 9:30 PM", phone: "+65 6333 4455",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-04-10', tags: ['modest fashion', 'hijab', 'abaya'],
        priceRange: '$$', lat: 1.2994, lng: 103.8554,
    },

    // ── Health & Wellness ──
    {
        id: "biz_11", name: "The Green Table", category: Category.HEALTH,
        address: "101 Thomson Rd, Singapore 307591", region: Region.CENTRAL,
        rating: 4.2, reviewCount: 45, imageUrl: IMG,
        description: "Halal-certified organic wellness cafe with cold-pressed juices, acai bowls, and plant-based meals.",
        openingHours: "Mon-Fri 8:00 AM - 8:00 PM, Sat-Sun 9:00 AM - 6:00 PM",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-04-15', tags: ['organic', 'healthy', 'plant-based'],
        priceRange: '$$', lat: 1.3140, lng: 103.8430,
    },
    {
        id: "biz_12", name: "FitMuslimah Studio", category: Category.HEALTH,
        address: "333 Kovan Rd, Singapore 544956", region: Region.NORTH,
        rating: 4.8, reviewCount: 52, imageUrl: IMG,
        description: "Women-only fitness studio offering ladies-only gym sessions, yoga, and Zumba in a private, hijab-friendly environment.",
        openingHours: "Mon-Sat 7:00 AM - 9:00 PM",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-05-01', tags: ['fitness', 'women only', 'gym'],
        priceRange: '$$', lat: 1.3606, lng: 103.8847,
    },

    // ── Professional Services ──
    {
        id: "biz_13", name: "Aqeel & Associates Law", category: Category.PROFESSIONAL,
        address: "1 North Bridge Rd, #18-08 High Street Centre", region: Region.CENTRAL,
        rating: 4.7, reviewCount: 19, imageUrl: IMG,
        description: "Shariah-compliant legal services including Islamic estate planning, wills (wasiat), and family law.",
        openingHours: "Mon-Fri 9:00 AM - 6:00 PM", phone: "+65 6338 0088",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-05-10', tags: ['law', 'shariah', 'estate planning'],
        priceRange: '$$',
    },
    {
        id: "biz_14", name: "Barakah Financial Advisory", category: Category.PROFESSIONAL,
        address: "80 Robinson Rd, #10-01", region: Region.CENTRAL,
        rating: 4.5, reviewCount: 14, imageUrl: IMG,
        description: "Islamic financial planning and halal investment advisory. Specializing in Shariah-compliant wealth management.",
        openingHours: "Mon-Fri 9:00 AM - 6:00 PM", phone: "+65 6225 1100",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-05-15', tags: ['finance', 'islamic', 'investment'],
        priceRange: '$$',
    },

    // ── Education ──
    {
        id: "biz_15", name: "AlQuran Academy SG", category: Category.EDUCATION,
        address: "30 Mosque St, Singapore 059508", region: Region.CENTRAL,
        rating: 4.9, reviewCount: 73, imageUrl: IMG,
        description: "Quran learning centre for all ages with tajweed classes, Arabic language courses, and Islamic studies.",
        openingHours: "Mon-Sat 9:00 AM - 9:00 PM, Sun 9:00 AM - 1:00 PM", phone: "+65 6222 7899",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-06-01', tags: ['quran', 'arabic', 'islamic studies'],
        priceRange: '$',
    },

    // ── Travel ──
    {
        id: "biz_16", name: "Deen Travel & Tours", category: Category.TRAVEL,
        address: "101 Beach Rd, #01-12 Shaw Tower", region: Region.CENTRAL,
        rating: 4.4, reviewCount: 41, imageUrl: IMG,
        description: "Specializing in Umrah and Hajj packages with licensed MUIS guides. Also offers Muslim-friendly holiday packages to Japan, Korea, and Turkey.",
        openingHours: "Mon-Fri 9:30 AM - 6:30 PM, Sat 10:00 AM - 2:00 PM", phone: "+65 6291 3344",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-06-10', tags: ['umrah', 'hajj', 'travel'],
        priceRange: '$$',
    },

    // ── Beauty ──
    {
        id: "biz_17", name: "Nailah Beauty Lounge", category: Category.BEAUTY,
        address: "681 Punggol Drive, #01-07 Oasis Terraces", region: Region.NORTH,
        rating: 4.6, reviewCount: 31, imageUrl: IMG,
        description: "Halal-certified beauty salon offering wudhu-friendly nail services, facial treatments, and bridal makeup.",
        openingHours: "Tue-Sun 10:00 AM - 8:00 PM", phone: "+65 6386 4455",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-06-15', tags: ['beauty', 'wudhu-friendly', 'bridal'],
        priceRange: '$$', lat: 1.4014, lng: 103.9097,
    },

    // ── Home Services ──
    {
        id: "biz_18", name: "Amanah Home Cleaning", category: Category.HOME,
        address: "23 Woodlands Ave 6, Singapore 738990", region: Region.NORTH,
        rating: 4.3, reviewCount: 22, imageUrl: IMG,
        description: "Trustworthy Muslim-owned home cleaning service. Deep cleaning, move-in/out, and regular weekly/monthly packages available.",
        openingHours: "Mon-Sat 8:00 AM - 6:00 PM", phone: "+65 8123 4567",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-07-01', tags: ['cleaning', 'home', 'trusted'],
        priceRange: '$',
    },

    // ── More Food across regions ──
    {
        id: "biz_19", name: "Fatboy's The Burger Bar", category: Category.FOOD,
        address: "187 Upper Thomson Rd, Singapore 574335", region: Region.NORTH,
        rating: 4.4, reviewCount: 68, imageUrl: IMG,
        description: "Gourmet halal burgers, loaded fries, and milkshakes. Known for their juicy Wagyu beef burgers.",
        openingHours: "Daily 12:00 PM - 10:00 PM", phone: "+65 6252 8780",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-07-10', tags: ['burgers', 'western', 'wagyu'],
        priceRange: '$$', lat: 1.3540, lng: 103.8350,
    },
    {
        id: "biz_20", name: "D'Authentic Nasi Ambeng", category: Category.FOOD,
        address: "Blk 630 Bedok Reservoir Rd, #01-12", region: Region.EAST,
        rating: 4.5, reviewCount: 39, imageUrl: IMG,
        description: "Communal Javanese nasi ambeng platters perfect for family gatherings. Traditional recipes passed down for generations.",
        openingHours: "Thu-Tue 10:00 AM - 9:00 PM", phone: "+65 6243 5567",
        isVerified: true,
        status: 'Approved', submissionDate: '2024-07-15', tags: ['nasi ambeng', 'javanese', 'family'],
        priceRange: '$', lat: 1.3370, lng: 103.9320,
    },

    // ── Pending submissions ──
    {
        id: "biz_21", name: "Makan Corner Express", category: Category.FOOD,
        address: "45 Tampines St 92, #01-501", region: Region.EAST,
        rating: 0, reviewCount: 0, imageUrl: IMG,
        description: "Quick-service halal eatery with local favorites — nasi goreng, mee rebus, and teh tarik.",
        status: 'Pending Review', submissionDate: '2024-08-01',
        ownerId: 'usr_demo_owner', tags: ['hawker', 'local', 'quick service'], priceRange: '$',
    },
    {
        id: "biz_22", name: "Bismillah Catering", category: Category.FOOD,
        address: "10 Ubi Crescent, #01-50 Ubi Techpark", region: Region.EAST,
        rating: 0, reviewCount: 0, imageUrl: IMG,
        description: "Professional halal catering for weddings, corporate events, and private parties.",
        status: 'Pending Review', submissionDate: '2024-08-05',
        tags: ['catering', 'events', 'wedding'], priceRange: '$$',
    },
];

export const SEED_EVENTS: Event[] = [
    {
        id: "evt_1", title: "Geylang Serai Ramadan Bazaar 2025", type: "Bazaar",
        date: "1 Mar - 30 Mar 2025", time: "10:00 AM - 11:00 PM Daily",
        location: "Wisma Geylang Serai", imageUrl: IMG,
        description: "Immerse yourself in the festive spirit at Singapore's largest Ramadan Bazaar! Over 700 stalls featuring food, fashion, crafts, and carnival rides.",
        isFree: true, organizer: "People's Association",
        lat: 1.3169, lng: 103.8985, status: 'Approved',
    },
    {
        id: "evt_2", title: "Singapore Halal Food Festival", type: "Food Festival",
        date: "15 Apr - 17 Apr 2025", time: "11:00 AM - 10:00 PM",
        location: "Marina Bay Sands Expo & Convention Centre", imageUrl: IMG,
        description: "Asia's premier halal food trade show and festival. Sample dishes from 50+ halal restaurants, attend cooking demos, and explore industry trends.",
        isFree: false, price: 15, organizer: "Halal Trade Events Pte Ltd",
        lat: 1.2833, lng: 103.8590, status: 'Approved',
    },
    {
        id: "evt_3", title: "Muslim Entrepreneurs Networking Night", type: "Seminar",
        date: "22 Feb 2025", time: "7:00 PM - 10:00 PM",
        location: "One Raffles Place, Level 30", imageUrl: IMG,
        description: "Monthly networking session for Muslim business owners and aspiring entrepreneurs. Guest speaker: Award-winning entrepreneur Fadzuli Ahmad.",
        isFree: false, price: 25, organizer: "Muslim Entrepreneurs Network SG",
        status: 'Approved',
    },
    {
        id: "evt_4", title: "Halal Cooking Masterclass: Nasi Briyani", type: "Workshop",
        date: "8 Mar 2025", time: "2:00 PM - 5:00 PM",
        location: "Community Club @ Tampines", imageUrl: IMG,
        description: "Learn to cook the perfect nasi briyani from Chef Azman. Includes all ingredients and take-home recipe booklet. Limited to 20 pax.",
        isFree: false, price: 45, organizer: "Culinary Academy SG",
        status: 'Approved',
    },
    {
        id: "evt_5", title: "Islamic Finance & Investment Seminar", type: "Seminar",
        date: "5 Apr 2025", time: "9:00 AM - 1:00 PM",
        location: "MUIS Academy, Braddell Rd", imageUrl: IMG,
        description: "Understand Shariah-compliant investing, halal REITs, and Islamic banking options available in Singapore.",
        isFree: true, organizer: "MUIS & Islamic Religious Council",
        status: 'Approved',
    },
    {
        id: "evt_6", title: "Hari Raya Aidilfitri Open House 2025", type: "Bazaar",
        date: "31 Mar 2025", time: "10:00 AM - 6:00 PM",
        location: "Malay Heritage Centre, Kampong Glam", imageUrl: IMG,
        description: "Community open house celebrating Hari Raya with traditional kuih, performances, and family-friendly activities.",
        isFree: true, organizer: "Malay Heritage Foundation",
        lat: 1.3022, lng: 103.8598, status: 'Approved',
    },
];

export const SEED_REVIEWS: UserReview[] = [
    // The Coconut Club
    { id: "rev_1", businessId: "biz_1", businessName: "The Coconut Club", userId: "usr_demo_user",
      userName: "Ahmad Hassan", rating: 5, comment: "Best nasi lemak in Singapore, hands down. The coconut rice is incredibly fragrant and the sambal has the perfect kick. Worth the queue!", date: "2024-08-15", vibeTags: ["Must Visit", "Authentic"], title: "Best Nasi Lemak Ever", helpful: 12 },
    { id: "rev_2", businessId: "biz_1", businessName: "The Coconut Club",
      userName: "Nurul Ain", rating: 5, comment: "Came here with my family for a weekend lunch. Every dish was cooked to perfection. The fried chicken was juicy and crispy. Ambience is lovely too.", date: "2024-07-20", vibeTags: ["Family-Friendly", "Great Ambience"], title: "Perfect Family Lunch" },
    { id: "rev_3", businessId: "biz_1", businessName: "The Coconut Club",
      userName: "James Lim", rating: 4, comment: "Really good food but the wait can be long during peak hours. I'd recommend going on weekday afternoons. The otah is a must-order!", date: "2024-06-10", vibeTags: ["Worth the Wait"], title: "Great Food, Long Queue" },

    // Hjh Maimunah
    { id: "rev_4", businessId: "biz_2", businessName: "Hjh Maimunah",
      userName: "Faizal Rahman", rating: 5, comment: "The nasi padang here is legendary. The beef rendang melts in your mouth and the sambal goreng is addictive. Go early before the popular dishes run out!", date: "2024-08-01", vibeTags: ["Legendary", "Go Early"], title: "Legendary Nasi Padang" },
    { id: "rev_5", businessId: "biz_2", businessName: "Hjh Maimunah",
      userName: "Sarah Tan", rating: 4, comment: "Consistently good quality. The variety of dishes is impressive. Can be crowded during lunch. Staff are friendly and efficient.", date: "2024-07-15", vibeTags: ["Consistent", "Friendly Staff"] },

    // Zamzam
    { id: "rev_6", businessId: "biz_3", businessName: "Zamzam Restaurant",
      userName: "Irfan Shah", rating: 5, comment: "Been coming here since I was a kid. The murtabak is still the best in Singapore. You can watch them make it fresh right in front of you. A true heritage experience!", date: "2024-08-10", vibeTags: ["Heritage", "Must Try"], title: "A Singapore Institution", helpful: 8 },
    { id: "rev_7", businessId: "biz_3", businessName: "Zamzam Restaurant",
      userName: "Priya Nair", rating: 4, comment: "The mutton murtabak is outstanding. Generous filling and perfectly crispy. The curry dip complements it well. Would recommend for tourists!", date: "2024-07-05", vibeTags: ["Tourist Friendly"] },

    // Al-Azhar
    { id: "rev_8", businessId: "biz_6", businessName: "Al-Azhar Eating Restaurant",
      userName: "Hafiz Abdullah", rating: 5, comment: "The ayam penyet here is legendary! Perfectly fried and the sambal is fiery. Their nasi briyani is equally amazing. Open late which is a huge plus.", date: "2024-08-20", vibeTags: ["Late Night", "Spicy"], title: "Late Night Halal Legend" },
    { id: "rev_9", businessId: "biz_6", businessName: "Al-Azhar Eating Restaurant",
      userName: "Zainab Yusof", rating: 4, comment: "Great supper spot! The portions are generous and prices are very reasonable. Love that it's open till midnight. Perfect post-terawih meal spot.", date: "2024-07-25", vibeTags: ["Value", "Generous Portions"] },

    // Carousel
    { id: "rev_10", businessId: "biz_8", businessName: "Carousel @ Royal Plaza",
      userName: "Aisha Begum", rating: 5, comment: "Premium halal buffet that actually delivers. The crab legs are endless, sashimi is fresh, and dessert section is heavenly. A bit pricey but worth it for celebrations.", date: "2024-08-05", vibeTags: ["Celebration", "Premium"], title: "Worth Every Dollar", helpful: 15 },

    // AlQuran Academy
    { id: "rev_11", businessId: "biz_15", businessName: "AlQuran Academy SG",
      userName: "Aminah Wong", rating: 5, comment: "My children have been attending weekly classes here for 2 years. The ustaz is patient and knowledgeable. The curriculum is well-structured and my kids love it.", date: "2024-08-12", vibeTags: ["Kid-Friendly", "Excellent Teachers"], title: "Excellent for Kids" },
    { id: "rev_12", businessId: "biz_15", businessName: "AlQuran Academy SG",
      userName: "Rizwan Malik", rating: 5, comment: "Started adult tajweed classes here. Very comfortable environment even for beginners. The small class sizes mean you get personal attention.", date: "2024-07-30", vibeTags: ["Beginner Friendly", "Personal Attention"] },

    // Wardah Books
    { id: "rev_13", businessId: "biz_9", businessName: "Wardah Books",
      userName: "Fatimah Ali", rating: 5, comment: "A hidden gem in Kampong Glam! Beautiful collection of Islamic books, both classic and contemporary. The owner is incredibly knowledgeable and helpful.", date: "2024-08-08", vibeTags: ["Hidden Gem", "Knowledgeable Staff"] },

    // FitMuslimah
    { id: "rev_14", businessId: "biz_12", businessName: "FitMuslimah Studio",
      userName: "Nadia Ibrahim", rating: 5, comment: "Finally a gym where I can work out comfortably in hijab! Great facilities, supportive community, and the instructors are amazing. The Zumba class is my favourite.", date: "2024-08-18", vibeTags: ["Empowering", "Great Community"], title: "Safe Space to Workout" },

    // Nailah Beauty
    { id: "rev_15", businessId: "biz_17", businessName: "Nailah Beauty Lounge",
      userName: "Suhaila Karim", rating: 4, comment: "Love that they use wudhu-friendly nail polish! The facial treatment was relaxing and my skin felt amazing after. Will definitely come back for their bridal package.", date: "2024-08-22", vibeTags: ["Wudhu-Friendly", "Relaxing"] },
];

export const SEED_BLOG_POSTS: BlogPost[] = [
    {
        id: 'blog_1', title: 'Top 10 Halal Cafes to Visit in Bugis for Brunch',
        category: 'Dining Spotlight', date: 'May 15, 2024', author: 'Sarah Ahmad', image: IMG,
        excerpt: 'Bugis is a treasure trove of Halal dining. From hidden gems to popular favorites, we explore the best brunch spots.',
        content: 'Bugis has become one of Singapore\'s most exciting halal dining destinations. Whether you\'re looking for classic Malay flavours or trendy fusion cuisine, this neighbourhood has something for everyone.\n\n**1. The Coconut Club** - Their signature nasi lemak with fragrant coconut rice is worth every minute of the queue.\n\n**2. I Am Cafe** - Instagram-worthy brunch spot with fluffy pancakes and artisan coffee.\n\n**3. Tipo Pasta Bar** - Fresh handmade pasta in a cozy setting.\n\n**4. Konditori** - Scandinavian-inspired cafe with excellent pastries.\n\n**5. Hjh Maimunah** - For those who prefer a traditional nasi padang brunch.\n\n**6. Kampong Glam Cafe** - Charming cafe with Middle Eastern-inspired dishes.\n\n**7. Zamzam** - Start your day with a legendary murtabak.\n\n**8. Bhai Sarbat** - Famous teh tarik to pair with any meal.\n\n**9. Royz et Vous** - French-Asian fusion in a beautiful shophouse.\n\n**10. Afterwit** - Specialty coffee and creative brunch plates.\n\nEach of these spots has been verified as halal-certified or Muslim-owned. Happy brunching!',
        tags: ['food', 'brunch', 'bugis', 'cafes'],
    },
    {
        id: 'blog_2', title: 'A Weekend Guide to Geylang Serai Market',
        category: 'Lifestyle', date: 'May 13, 2024', author: 'Hafiz Ismail', image: IMG,
        excerpt: 'Experience the rich heritage and bustling atmosphere of one of Singapore\'s oldest Malay settlements.',
        content: 'Geylang Serai is more than just a market — it\'s the cultural heartbeat of the Malay community in Singapore.\n\n## Morning\nStart your day early at the wet market. The freshest produce, spices, and ingredients arrive before 8 AM. Don\'t miss the kuih stall near the entrance — their ondeh-ondeh is legendary.\n\n## Afternoon\nExplore the Malay Heritage Centre nearby in Kampong Glam. Then head to the textile shops along Joo Chiat for beautiful batik fabrics.\n\n## Evening\nAs the sun sets, the Geylang Serai area comes alive. Street food stalls set up along the main road. Try the mee rebus, satay, and end with a refreshing bandung.\n\n## During Ramadan\nThe area transforms into the famous Ramadan Bazaar with over 700 stalls. It\'s an experience every Singaporean should have at least once.',
        tags: ['lifestyle', 'culture', 'geylang serai', 'heritage'],
    },
    {
        id: 'blog_3', title: 'Understanding Halal Certification for SMEs',
        category: 'Business', date: 'May 10, 2024', author: 'Dr. Yusof Ahmad', image: IMG,
        excerpt: 'A comprehensive guide to how MUIS certification works for small businesses and why it matters.',
        content: 'Getting halal certification from MUIS (Majlis Ugama Islam Singapura) is a significant step for any food business in Singapore.\n\n## Why Get Certified?\n- Access to Singapore\'s 700,000+ Muslim consumers\n- Build trust and credibility\n- Expand your customer base\n- Required for government and corporate catering\n\n## The Process\n1. **Application** - Submit through MUIS online portal\n2. **Documentation** - Provide ingredient lists, supplier halal certs, and kitchen layout\n3. **Inspection** - MUIS officers will visit your premises\n4. **Approval** - Typically 4-6 weeks after inspection\n5. **Renewal** - Annual renewal required\n\n## Costs\n- Eating establishment: $290/year\n- Food products: $480/year\n- Industrial kitchen: $690/year\n\n## Tips for Success\n- Ensure ALL ingredients have halal documentation\n- Maintain separate storage for halal and non-halal items\n- Train all staff on halal requirements\n- Keep records updated and accessible',
        tags: ['business', 'halal certification', 'MUIS', 'guide'],
    },
    {
        id: 'blog_4', title: 'Muslim-Friendly Travel: 48 Hours in Osaka',
        category: 'Travel', date: 'Apr 28, 2024', author: 'Nurul Huda', image: IMG,
        excerpt: 'A practical guide to finding halal food, prayer spaces, and must-visit attractions in Osaka, Japan.',
        content: 'Japan is becoming increasingly Muslim-friendly, and Osaka is leading the way. Here\'s how to spend a perfect 48 hours.\n\n## Day 1\n**Morning:** Visit Osaka Castle and pack onigiri from the halal convenience store near Namba.\n**Lunch:** Halal Kobe beef at Matsusaka Beef M (halal certified).\n**Afternoon:** Explore Dotonbori and try halal takoyaki at Halal Takoyaki Kuku.\n**Dinner:** Indian-Pakistani restaurant Hindustan near Shin-Imamiya station.\n\n## Day 2\n**Morning:** Visit Shitennoji Temple (Japan\'s oldest Buddhist temple).\n**Lunch:** Halal ramen at Naritaya Ramen in Dotonbori.\n**Afternoon:** Shopping at Shinsaibashi and visit the prayer room at Namba Parks.\n**Dinner:** Turkish restaurant Alaturca with city views.\n\n## Prayer Spaces\n- Osaka Ibaraki Mosque (full facilities)\n- Namba Parks prayer room\n- Kansai Airport musolla\n\n## Tips\n- Download the Halal Navi app\n- Carry a pocket prayer mat\n- Learn to say "butaniku nashi" (no pork) in Japanese',
        tags: ['travel', 'japan', 'osaka', 'muslim-friendly'],
    },
    {
        id: 'blog_5', title: 'Hari Raya Fashion Trends 2025',
        category: 'Lifestyle', date: 'Apr 20, 2024', author: 'Aisyah Lim', image: IMG,
        excerpt: 'From pastel abayas to modern baju kurung, discover this year\'s hottest modest fashion trends.',
        content: 'Hari Raya is not just about food — it\'s also a chance to dress your best! Here are the biggest modest fashion trends for 2025.\n\n## 1. Pastel Palettes\nSoft lavender, sage green, and dusty rose are dominating this year. Perfect for family photos!\n\n## 2. Modern Baju Kurung\nContemporary cuts with puff sleeves, asymmetric hemlines, and structured silhouettes are refreshing the classic baju kurung.\n\n## 3. Textured Hijabs\nPleated, crinkle, and jacquard textures add dimension to any outfit without relying on bold colours.\n\n## 4. Matching Family Sets\nCoordinated outfits for the whole family are bigger than ever. Look for brands offering mini-me versions.\n\n## 5. Sustainable Fashion\nMore Muslim fashion brands are offering eco-friendly options. Look for organic cotton and recycled fabrics.\n\n## Where to Shop in Singapore\n- Noura Modest Fashion (Bugis Junction)\n- Poplook (online)\n- dUCk (ION Orchard)\n- Love to Dress (Haji Lane)',
        tags: ['fashion', 'hari raya', 'modest fashion', 'trends'],
    },
    {
        id: 'blog_6', title: 'How to Start a Halal Home Business in Singapore',
        category: 'Business', date: 'Apr 15, 2024', author: 'Fadzuli Ahmad', image: IMG,
        excerpt: 'Step-by-step guide for aspiring Muslim entrepreneurs looking to start a food business from home.',
        content: 'The home-based business scene in Singapore is thriving, and halal food businesses are in high demand.\n\n## Step 1: Choose Your Niche\nFind what you do best — whether it\'s cookies, cakes, frozen meals, or sambal. Focus on ONE thing and perfect it.\n\n## Step 2: Register Your Business\n- Register with ACRA ($315 for sole proprietorship)\n- Apply for SFA food shop licence\n- Consider MUIS halal certification\n\n## Step 3: Set Up Your Kitchen\n- Dedicate a space for business cooking\n- Invest in proper food storage\n- Get food-grade packaging\n\n## Step 4: Build Your Brand\n- Create an Instagram business account\n- Design a simple logo (Canva works great)\n- Take beautiful food photos with natural lighting\n\n## Step 5: Start Selling\n- Begin with friends and family\n- List on platforms like WhyQ and GrabFood\n- Join pasar malam and bazaars\n\n## Costs to Budget\n- ACRA registration: $315\n- SFA licence: $195/year\n- MUIS cert: $290/year\n- Initial ingredients & packaging: ~$500\n- Total startup: ~$1,300',
        tags: ['business', 'entrepreneurship', 'home business', 'guide'],
    },
];

// Demo account passwords — seeded as plaintext, auto-migrated to SHA-256 on first login (see auth.ts)
export const SEED_DEMO_PASSWORDS: Record<string, string> = {
    'admin@halalbiz.sg': 'admin123',
    'ahmad@example.com': 'password123',
    'owner@example.com': 'owner123',
};

export const SEED_USERS: User[] = [
    {
        id: 'usr_admin', email: 'admin@halalbiz.sg', name: 'Admin',
        role: 'admin', createdAt: '2024-01-01', bookmarks: [], subscription: 'corporate',
        subscriptionStatus: 'active',
    },
    {
        id: 'usr_demo_user', email: 'ahmad@example.com', name: 'Ahmad Hassan',
        role: 'user', createdAt: '2024-03-15', bookmarks: ['biz_1', 'biz_3', 'biz_8'],
        subscription: 'free',
    },
    {
        id: 'usr_demo_owner', email: 'owner@example.com', name: 'Siti Nurhaliza',
        role: 'business_owner', createdAt: '2024-02-20', bookmarks: [],
        subscription: 'premium', subscriptionStatus: 'active', subscriptionExpiry: '2025-12-20',
    },
];
