// Dummy data to initialize if local storage is empty
const dummyRecipes = [
    {
        id: 1,
        title: "Classic Margherita Pizza",
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a30536?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        time: "30",
        difficulty: "Medium",
        cuisine: "Italian",
        desc: "A traditional Italian pizza with fresh tomatoes, mozzarella cheese, and sweet basil on a perfectly baked crust.",
        ingredients: ["1 Pizza dough", "1/2 cup Tomato sauce", "8 oz Fresh mozzarella", "Handful of Fresh basil leaves", "2 tbsp Olive oil", "Pinch of Salt"],
        steps: ["Preheat oven to 475°F (245°C).", "Roll out the dough on a floured surface.", "Spread tomato sauce evenly over the dough.", "Add slices of fresh mozzarella.", "Bake for 10-12 minutes until crust is golden.", "Garnish with fresh basil and a drizzle of olive oil before serving."],
        likes: 124,
        dateAdded: new Date().toISOString()
    },
    {
        id: 2,
        title: "Spicy Chicken Curry",
        image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        time: "45",
        difficulty: "Hard",
        cuisine: "Indian",
        desc: "A rich and spicy Indian chicken curry cooked with aromatic spices and creamy coconut milk.",
        ingredients: ["500g Chicken, cubed", "2 Onions, finely chopped", "3 Tomatoes, pureed", "2 tbsp Curry powder", "1 cup Coconut milk", "1 tbsp Garlic and ginger paste", "Cilantro for garnish"],
        steps: ["Marinate chicken with a portion of the spices.", "Sauté onions, ginger, and garlic until golden brown.", "Add pureed tomatoes and cook until oil separates.", "Add the marinated chicken and cook for 10 minutes.", "Pour in coconut milk and simmer for 20 minutes.", "Garnish with fresh cilantro and serve hot."],
        likes: 89,
        dateAdded: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 3,
        title: "Avocado Toast with Egg",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        time: "15",
        difficulty: "Easy",
        cuisine: "American",
        desc: "A quick, healthy, and delicious breakfast loaded with protein, healthy fats, and incredible flavor.",
        ingredients: ["2 slices of Whole wheat bread", "1 Ripe avocado", "2 Eggs", "Salt and black pepper to taste", "Pinch of Chili flakes", "1 tsp Lemon juice"],
        steps: ["Toast the bread slices to your liking.", "Mash the avocado with lemon juice, salt, and pepper.", "Fry or poach the eggs.", "Spread the mashed avocado generously on the toast.", "Top each slice with an egg.", "Sprinkle chili flakes and serve immediately."],
        likes: 210,
        dateAdded: new Date(Date.now() - 172800000).toISOString()
    },
    {
        id: 4,
        title: "Authentic Pad Thai",
        image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        time: "40",
        difficulty: "Medium",
        cuisine: "Asian",
        desc: "Sweet, sour, and salty Thai stir-fried noodles with peanuts, bean sprouts, and lime.",
        ingredients: ["8 oz Rice noodles", "200g Shrimp or Chicken", "2 Eggs", "1 cup Bean sprouts", "1/4 cup Crushed peanuts", "Pad Thai sauce (tamarind, fish sauce, sugar)"],
        steps: ["Soak rice noodles in warm water until flexible.", "Stir-fry the protein until cooked, then push to the side.", "Scramble the eggs in the pan.", "Add noodles and Pad Thai sauce, tossing constantly.", "Toss in bean sprouts and peanuts.", "Serve with a lime wedge."],
        likes: 156,
        dateAdded: new Date(Date.now() - 259200000).toISOString()
    }
];

// State Management
let recipes = JSON.parse(localStorage.getItem('rohan_recipes')) || dummyRecipes;
let favorites = JSON.parse(localStorage.getItem('rohan_favorites')) || [];
let isDarkMode = localStorage.getItem('rohan_theme') === 'dark';

// DOM Elements
const recipeGrid = document.getElementById('recipe-grid');
const favoritesGrid = document.getElementById('favorites-grid');
const trendingCarousel = document.getElementById('trending-carousel');
const rotdContainer = document.getElementById('rotd-container');
const addRecipeForm = document.getElementById('add-recipe-form');
const searchInput = document.getElementById('search-input');
const filterCuisine = document.getElementById('filter-cuisine');
const filterDifficulty = document.getElementById('filter-difficulty');
const filterTime = document.getElementById('filter-time');
const themeToggle = document.getElementById('theme-toggle');
const notificationContainer = document.getElementById('notification-container');
const modal = document.getElementById('recipe-modal');
const modalBody = document.getElementById('modal-body');
const closeModal = document.querySelector('.close-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('rohan_recipes')) {
        saveRecipes();
    }
    
    applyTheme();
    renderAll();
    
    // Remove loading screen
    setTimeout(() => {
        const loader = document.getElementById('loading-screen');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1500);
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem('rohan_theme', isDarkMode ? 'dark' : 'light');
    applyTheme();
});

function applyTheme() {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Render Functions
function renderAll() {
    renderRecipes(recipes, recipeGrid);
    renderFavorites();
    renderTrending();
    renderRecipeOfTheDay();
}

function createRecipeCard(recipe, isFavorite = false) {
    const isFav = favorites.includes(recipe.id) || isFavorite;
    return `
        <div class="recipe-card glass" onclick="openRecipeModal(${recipe.id})">
            <div class="card-actions">
                <button class="action-btn like-btn" onclick="event.stopPropagation(); toggleLike(${recipe.id})" title="Like">
                    <i class="fas fa-heart" style="color: ${recipe.likes > 0 ? 'var(--primary-color)' : '#333'}"></i>
                </button>
                <button class="action-btn fav-btn ${isFav ? 'active' : ''}" onclick="event.stopPropagation(); toggleFavorite(${recipe.id})" title="Favorite">
                    <i class="fas fa-bookmark" style="color: ${isFav ? 'var(--primary-color)' : '#333'}"></i>
                </button>
                <button class="action-btn del-btn" onclick="event.stopPropagation(); deleteRecipe(${recipe.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-img" onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
            <div class="recipe-info">
                <div class="recipe-meta" style="margin-bottom: 12px;">
                    <span class="badge">${recipe.difficulty}</span>
                    <span><i class="fas fa-clock"></i> ${recipe.time}m</span>
                </div>
                <h3 class="recipe-title">${recipe.title}</h3>
                <p class="recipe-desc">${recipe.desc}</p>
                <div class="recipe-meta" style="margin-top: 15px; color: var(--text-color); opacity: 0.8; font-size: 0.85rem;">
                    <span><i class="fas fa-heart" style="color: var(--primary-color)"></i> ${recipe.likes || 0}</span>
                    <span><i class="fas fa-globe"></i> ${recipe.cuisine}</span>
                </div>
            </div>
        </div>
    `;
}

function renderRecipes(recipesToRender, container) {
    if (recipesToRender.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;" class="glass">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 20px;"></i>
                <h2>No recipes found</h2>
                <p>Try adjusting your search or filters.</p>
            </div>
        `;
        return;
    }
    container.innerHTML = recipesToRender.map(r => createRecipeCard(r)).join('');
}

function renderFavorites() {
    const favRecipes = recipes.filter(r => favorites.includes(r.id));
    renderRecipes(favRecipes, favoritesGrid);
    const favSection = document.getElementById('favorites-section');
    if (favRecipes.length > 0) {
        favSection.style.display = 'block';
    } else {
        favSection.style.display = 'none';
    }
}

function renderTrending() {
    if (recipes.length === 0) {
        document.getElementById('trending-section').style.display = 'none';
        return;
    }
    document.getElementById('trending-section').style.display = 'block';
    
    // Sort by likes
    const trending = [...recipes].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);
    trendingCarousel.innerHTML = trending.map(r => `
        <div class="carousel-item">
            ${createRecipeCard(r)}
        </div>
    `).join('');
}

function renderRecipeOfTheDay() {
    const rotdSection = document.getElementById('recipe-of-the-day');
    if (recipes.length === 0) {
        rotdSection.style.display = 'none';
        return;
    }
    rotdSection.style.display = 'block';
    
    // Pick a pseudo-random recipe based on current day
    const day = new Date().getDay();
    const rotd = recipes[day % recipes.length];
    
    rotdContainer.innerHTML = `
        <img src="${rotd.image}" alt="${rotd.title}" class="rotd-img" onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
        <div class="rotd-info">
            <span class="badge" style="width: fit-content; margin-bottom: 15px;">${rotd.cuisine}</span>
            <h3 style="font-size: 2.5rem; margin-bottom: 15px; color: var(--primary-color);">${rotd.title}</h3>
            <p style="margin-bottom: 25px; line-height: 1.6; font-size: 1.1rem; opacity: 0.9;">${rotd.desc}</p>
            <div class="recipe-meta" style="margin-bottom: 30px; font-size: 1.1rem;">
                <span><i class="fas fa-clock"></i> ${rotd.time} mins</span>
                <span><i class="fas fa-signal"></i> ${rotd.difficulty}</span>
                <span><i class="fas fa-heart"></i> ${rotd.likes || 0} Likes</span>
            </div>
            <button class="btn-primary" style="width: auto; display: inline-block;" onclick="openRecipeModal(${rotd.id})">
                <i class="fas fa-book-open" style="margin-right: 8px;"></i> View Full Recipe
            </button>
        </div>
    `;
}

// Actions
function toggleFavorite(id) {
    const index = favorites.indexOf(id);
    if (index === -1) {
        favorites.push(id);
        showNotification('Added to Favorites!');
    } else {
        favorites.splice(index, 1);
        showNotification('Removed from Favorites!');
    }
    saveFavorites();
    renderAll();
}

function toggleLike(id) {
    const recipe = recipes.find(r => r.id === id);
    if(recipe) {
        recipe.likes = (recipe.likes || 0) + 1;
        saveRecipes();
        renderAll();
        showNotification('Recipe Liked! 💖');
    }
}

function deleteRecipe(id) {
    if(confirm("Are you sure you want to delete this recipe?")) {
        recipes = recipes.filter(r => r.id !== id);
        // Remove from favorites if it's there
        favorites = favorites.filter(fId => fId !== id);
        saveRecipes();
        saveFavorites();
        renderAll();
        showNotification('Recipe Deleted Successfully!');
    }
}

// Add Recipe Form
addRecipeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newRecipe = {
        id: Date.now(),
        title: document.getElementById('recipe-title').value.trim(),
        image: document.getElementById('recipe-image').value.trim(),
        time: document.getElementById('recipe-time').value,
        difficulty: document.getElementById('recipe-difficulty').value,
        cuisine: document.getElementById('recipe-cuisine').value,
        desc: document.getElementById('recipe-desc').value.trim(),
        ingredients: document.getElementById('recipe-ingredients').value.split('\n').filter(i => i.trim() !== ''),
        steps: document.getElementById('recipe-steps').value.split('\n').filter(s => s.trim() !== ''),
        likes: 0,
        dateAdded: new Date().toISOString()
    };
    
    recipes.unshift(newRecipe);
    saveRecipes();
    renderAll();
    addRecipeForm.reset();
    showNotification('Recipe Added Successfully! 🎉');
    
    // Scroll to recipes section
    document.getElementById('recipes-section').scrollIntoView({ behavior: 'smooth' });
});

// Search and Filter
function handleSearchAndFilter() {
    const searchTerm = searchInput.value.toLowerCase();
    const cuisine = filterCuisine.value;
    const difficulty = filterDifficulty.value;
    const timeFilter = filterTime.value;

    const filtered = recipes.filter(recipe => {
        const matchSearch = recipe.title.toLowerCase().includes(searchTerm) || recipe.desc.toLowerCase().includes(searchTerm);
        const matchCuisine = cuisine === 'all' || recipe.cuisine === cuisine;
        const matchDifficulty = difficulty === 'all' || recipe.difficulty === difficulty;
        
        let matchTime = true;
        const time = parseInt(recipe.time);
        if (timeFilter === 'under30') matchTime = time <= 30;
        if (timeFilter === 'under60') matchTime = time <= 60;
        if (timeFilter === 'over60') matchTime = time > 60;

        return matchSearch && matchCuisine && matchDifficulty && matchTime;
    });

    renderRecipes(filtered, recipeGrid);
}

searchInput.addEventListener('input', handleSearchAndFilter);
filterCuisine.addEventListener('change', handleSearchAndFilter);
filterDifficulty.addEventListener('change', handleSearchAndFilter);
filterTime.addEventListener('change', handleSearchAndFilter);

// Modal
function openRecipeModal(id) {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;

    modalBody.innerHTML = `
        <img src="${recipe.image}" alt="${recipe.title}" class="modal-header-img" onerror="this.src='https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'">
        <div class="modal-details">
            <h2>${recipe.title}</h2>
            <div class="modal-meta">
                <span><i class="fas fa-clock"></i> ${recipe.time} mins</span>
                <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
                <span><i class="fas fa-globe"></i> ${recipe.cuisine}</span>
                <span><i class="fas fa-heart"></i> ${recipe.likes || 0} Likes</span>
            </div>
            <p style="font-size: 1.15rem; line-height: 1.7; margin-bottom: 20px;">${recipe.desc}</p>
            
            <div class="lists-container">
                <div class="ingredients-list">
                    <h3>Ingredients</h3>
                    <ul>
                        ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>
                <div class="steps-list">
                    <h3>Cooking Instructions</h3>
                    <ol>
                        ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
            
            <div class="modal-author">
                <p><i class="fas fa-check-circle"></i> Recipe shared by: Rohan J C</p>
            </div>
        </div>
    `;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

closeModal.onclick = () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.onclick = (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Navigation active state
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Utilities
function saveRecipes() {
    localStorage.setItem('rohan_recipes', JSON.stringify(recipes));
}

function saveFavorites() {
    localStorage.setItem('rohan_favorites', JSON.stringify(favorites));
}

function showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.innerHTML = `<i class="fas fa-info-circle"></i> <span>${message}</span>`;
    notificationContainer.appendChild(notif);
    
    setTimeout(() => {
        notif.style.animation = 'slideLeft 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) reverse forwards';
        setTimeout(() => notif.remove(), 400);
    }, 3000);
}

// Simple Tips Slider
const tips = [
    "Always taste your food as you cook to ensure proper seasoning!",
    "Read the entire recipe before you start cooking.",
    "A sharp knife is safer than a dull one.",
    "Let meat rest before slicing to keep the juices in.",
    "Clean as you go to avoid a huge mess at the end.",
    "Use fresh herbs at the very end of cooking to preserve their flavor."
];

let currentTip = 0;
setInterval(() => {
    const tipElement = document.getElementById('current-tip');
    tipElement.style.opacity = '0';
    setTimeout(() => {
        currentTip = (currentTip + 1) % tips.length;
        tipElement.innerHTML = `<i class="fas fa-lightbulb"></i><p>${tips[currentTip]}</p>`;
        tipElement.style.opacity = '1';
    }, 500);
}, 6000);
