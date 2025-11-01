// Clash Royale Deck Suggester
// Using API endpoint - works for both local and production
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const PROXY_URL = isProduction ? '' : 'http://localhost:3000';
const API_BASE_URL = 'https://api.clashroyale.com/v1'; // Used for reference only

// Popular meta decks for suggestions
const META_DECKS = [
    {
        name: 'Golem Beatdown',
        cards: ['Golem', 'Night Witch', 'Baby Dragon', 'Tornado', 'Lumberjack', 'Mega Minion', 'Lightning', 'Barbarian Barrel'],
        elixir: 4.4,
        type: 'Beatdown'
    },
    {
        name: 'Hog Cycle',
        cards: ['Hog Rider', 'Ice Golem', 'Ice Spirit', 'Skeletons', 'Cannon', 'Fireball', 'Log', 'Musketeer'],
        elixir: 2.9,
        type: 'Cycle'
    },
    {
        name: 'LavaLoon',
        cards: ['Lava Hound', 'Balloon', 'Mega Minion', 'Tombstone', 'Arrows', 'Fireball', 'Skeleton Dragons', 'Barbarians'],
        elixir: 4.1,
        type: 'Beatdown'
    },
    {
        name: 'X-Bow',
        cards: ['X-Bow', 'Tesla', 'Ice Golem', 'Archers', 'Fireball', 'Log', 'Skeletons', 'Ice Spirit'],
        elixir: 3.3,
        type: 'Siege'
    },
    {
        name: 'Royal Giant',
        cards: ['Royal Giant', 'Furnace', 'Mega Minion', 'Lightning', 'Log', 'Barbarians', 'Zap', 'Fireball'],
        elixir: 4.0,
        type: 'Beatdown'
    },
    {
        name: 'PEKKA Bridge Spam',
        cards: ['PEKKA', 'Battle Ram', 'Bandit', 'Royal Ghost', 'Poison', 'Zap', 'Electro Wizard', 'Mega Minion'],
        elixir: 4.0,
        type: 'Control'
    },
    {
        name: 'Graveyard',
        cards: ['Graveyard', 'Poison', 'Ice Golem', 'Knight', 'Arrows', 'Tombstone', 'Baby Dragon', 'Mega Minion'],
        elixir: 3.6,
        type: 'Control'
    },
    {
        name: 'Giant Double Prince',
        cards: ['Giant', 'Prince', 'Dark Prince', 'Mega Minion', 'Fireball', 'Zap', 'Goblin Gang', 'Electro Wizard'],
        elixir: 4.1,
        type: 'Beatdown'
    }
];

// Card metadata for AI recommendations
const CARD_METADATA = {
    // Win Conditions
    'Golem': { role: 'winCondition', elixir: 8, archetypes: ['Beatdown'], synergies: ['Night Witch', 'Baby Dragon', 'Lumberjack'] },
    'Giant': { role: 'winCondition', elixir: 5, archetypes: ['Beatdown'], synergies: ['Prince', 'Dark Prince', 'Witch'] },
    'Hog Rider': { role: 'winCondition', elixir: 4, archetypes: ['Cycle', 'Control'], synergies: ['Ice Golem', 'Ice Spirit', 'Musketeer'] },
    'Royal Giant': { role: 'winCondition', elixir: 6, archetypes: ['Beatdown'], synergies: ['Furnace', 'Barbarians', 'Mega Minion'] },
    'Lava Hound': { role: 'winCondition', elixir: 7, archetypes: ['Beatdown'], synergies: ['Balloon', 'Mega Minion', 'Baby Dragon'] },
    'X-Bow': { role: 'winCondition', elixir: 6, archetypes: ['Siege'], synergies: ['Tesla', 'Ice Golem', 'Archers'] },
    'Battle Ram': { role: 'winCondition', elixir: 4, archetypes: ['Control'], synergies: ['Bandit', 'Royal Ghost', 'Electro Wizard'] },
    'Balloon': { role: 'winCondition', elixir: 5, archetypes: ['Beatdown'], synergies: ['Lava Hound', 'Freeze', 'Mega Minion'] },
    'Graveyard': { role: 'winCondition', elixir: 5, archetypes: ['Control'], synergies: ['Poison', 'Ice Golem', 'Knight'] },
    'Goblin Barrel': { role: 'winCondition', elixir: 3, archetypes: ['Cycle', 'Control'], synergies: ['Princess', 'Goblin Gang', 'Knight'] },
    'Goblin Giant': { role: 'winCondition', elixir: 6, archetypes: ['Beatdown'], synergies: ['Sparky', 'Electro Wizard', 'Mega Minion'] },
    'Mega Knight': { role: 'winCondition', elixir: 7, archetypes: ['Control'], synergies: ['Bandit', 'Royal Ghost', 'Electro Wizard'] },
    'Giant Skeleton': { role: 'winCondition', elixir: 6, archetypes: ['Control'], synergies: ['Tornado', 'Bomber', 'Wizard'] },
    'PEKKA': { role: 'winCondition', elixir: 7, archetypes: ['Control'], synergies: ['Bandit', 'Royal Ghost', 'Electro Wizard'] },
    'Ram Rider': { role: 'winCondition', elixir: 5, archetypes: ['Control'], synergies: ['Electro Wizard', 'Mega Minion', 'Zap'] },
    'Miner': { role: 'winCondition', elixir: 3, archetypes: ['Cycle', 'Control'], synergies: ['Poison', 'Goblin Gang', 'Knight'] },
    'Sparky': { role: 'winCondition', elixir: 6, archetypes: ['Beatdown'], synergies: ['Giant', 'Goblin Giant', 'Wizard'] },
    'Skeleton Barrel': { role: 'winCondition', elixir: 3, archetypes: ['Cycle'], synergies: ['Knight', 'Goblin Gang', 'Zap'] },

    // Tanks
    'Ice Golem': { role: 'tank', elixir: 2, archetypes: ['Cycle', 'Control'], synergies: ['Hog Rider', 'Graveyard', 'X-Bow'] },
    'Knight': { role: 'tank', elixir: 3, archetypes: ['Cycle', 'Control'], synergies: ['Graveyard', 'Goblin Barrel', 'Miner'] },
    'Valkyrie': { role: 'tank', elixir: 4, archetypes: ['Control'], synergies: ['Mega Knight', 'Wizard', 'Goblin Gang'] },

    // Support/Air Defense
    'Baby Dragon': { role: 'support', elixir: 4, archetypes: ['Beatdown'], synergies: ['Golem', 'Giant', 'Lava Hound'] },
    'Mega Minion': { role: 'support', elixir: 3, archetypes: ['Beatdown', 'Control'], synergies: ['Golem', 'Giant', 'Lava Hound'] },
    'Musketeer': { role: 'support', elixir: 4, archetypes: ['Cycle', 'Control'], synergies: ['Hog Rider', 'Knight', 'Ice Golem'] },
    'Wizard': { role: 'support', elixir: 5, archetypes: ['Beatdown', 'Control'], synergies: ['Giant', 'Goblin Giant', 'Valkyrie'] },
    'Electro Wizard': { role: 'support', elixir: 4, archetypes: ['Control'], synergies: ['PEKKA', 'Battle Ram', 'Bandit'] },
    'Witch': { role: 'support', elixir: 5, archetypes: ['Beatdown'], synergies: ['Giant', 'Golem', 'Valkyrie'] },
    'Night Witch': { role: 'support', elixir: 4, archetypes: ['Beatdown'], synergies: ['Golem', 'Giant', 'Lumberjack'] },
    'Ice Wizard': { role: 'support', elixir: 3, archetypes: ['Control'], synergies: ['Graveyard', 'Tornado', 'Knight'] },
    'Magic Archer': { role: 'support', elixir: 4, archetypes: ['Cycle', 'Control'], synergies: ['Hog Rider', 'Knight', 'Ice Golem'] },
    'Princess': { role: 'support', elixir: 3, archetypes: ['Cycle', 'Control'], synergies: ['Goblin Barrel', 'Knight', 'Log'] },
    'Archers': { role: 'support', elixir: 3, archetypes: ['Cycle', 'Siege'], synergies: ['X-Bow', 'Ice Golem', 'Knight'] },
    'Skeleton Dragons': { role: 'support', elixir: 4, archetypes: ['Beatdown'], synergies: ['Lava Hound', 'Balloon', 'Giant'] },
    'Minions': { role: 'support', elixir: 3, archetypes: ['Cycle', 'Beatdown'], synergies: ['Hog Rider', 'Giant', 'Golem'] },
    'Minion Horde': { role: 'support', elixir: 5, archetypes: ['Beatdown'], synergies: ['Giant', 'Golem', 'Goblin Giant'] },

    // Spells
    'Fireball': { role: 'spell', elixir: 4, archetypes: ['Cycle', 'Control', 'Beatdown'], synergies: [] },
    'Lightning': { role: 'spell', elixir: 6, archetypes: ['Beatdown'], synergies: ['Golem', 'Royal Giant', 'Giant'] },
    'Poison': { role: 'spell', elixir: 4, archetypes: ['Control'], synergies: ['Graveyard', 'Miner', 'PEKKA'] },
    'Arrows': { role: 'spell', elixir: 3, archetypes: ['Cycle', 'Beatdown'], synergies: ['Lava Hound', 'Balloon', 'Minions'] },
    'Zap': { role: 'spell', elixir: 2, archetypes: ['Cycle', 'Control', 'Beatdown'], synergies: [] },
    'Log': { role: 'spell', elixir: 2, archetypes: ['Cycle', 'Control'], synergies: ['Hog Rider', 'Goblin Barrel', 'Princess'] },
    'Tornado': { role: 'spell', elixir: 3, archetypes: ['Control'], synergies: ['Ice Wizard', 'Executioner', 'Baby Dragon'] },
    'Freeze': { role: 'spell', elixir: 4, archetypes: ['Beatdown'], synergies: ['Balloon', 'Hog Rider', 'Golem'] },
    'Rocket': { role: 'spell', elixir: 6, archetypes: ['Control'], synergies: ['X-Bow', 'Mortar', 'Miner'] },
    'Earthquake': { role: 'spell', elixir: 3, archetypes: ['Cycle', 'Control'], synergies: ['Hog Rider', 'Miner', 'X-Bow'] },
    'Goblin Barrel': { role: 'spell', elixir: 3, archetypes: ['Cycle', 'Control'], synergies: ['Knight', 'Princess', 'Log'] },
    'Barbarian Barrel': { role: 'spell', elixir: 2, archetypes: ['Beatdown'], synergies: ['Golem', 'Giant', 'Night Witch'] },

    // Buildings
    'Inferno Tower': { role: 'building', elixir: 5, archetypes: ['Control'], synergies: ['Knight', 'Musketeer', 'Ice Golem'] },
    'Cannon': { role: 'building', elixir: 3, archetypes: ['Cycle'], synergies: ['Hog Rider', 'Ice Golem', 'Musketeer'] },
    'Tesla': { role: 'building', elixir: 4, archetypes: ['Siege'], synergies: ['X-Bow', 'Ice Golem', 'Archers'] },
    'Tombstone': { role: 'building', elixir: 3, archetypes: ['Beatdown', 'Control'], synergies: ['Lava Hound', 'Graveyard', 'Giant'] },
    'Furnace': { role: 'building', elixir: 4, archetypes: ['Beatdown'], synergies: ['Royal Giant', 'Giant', 'Golem'] },
    'Goblin Hut': { role: 'building', elixir: 5, archetypes: ['Beatdown'], synergies: ['Giant', 'Golem', 'Royal Giant'] },
    'Mortar': { role: 'building', elixir: 4, archetypes: ['Siege'], synergies: ['Knight', 'Archers', 'Ice Golem'] },

    // Troops
    'Lumberjack': { role: 'troop', elixir: 4, archetypes: ['Beatdown'], synergies: ['Golem', 'Giant', 'Baby Dragon'] },
    'Bandit': { role: 'troop', elixir: 3, archetypes: ['Control'], synergies: ['PEKKA', 'Battle Ram', 'Royal Ghost'] },
    'Royal Ghost': { role: 'troop', elixir: 3, archetypes: ['Control'], synergies: ['PEKKA', 'Battle Ram', 'Bandit'] },
    'Dark Prince': { role: 'troop', elixir: 4, archetypes: ['Beatdown'], synergies: ['Giant', 'Prince', 'Electro Wizard'] },
    'Prince': { role: 'troop', elixir: 5, archetypes: ['Beatdown'], synergies: ['Giant', 'Dark Prince', 'Electro Wizard'] },
    'Executioner': { role: 'troop', elixir: 5, archetypes: ['Control'], synergies: ['Tornado', 'Ice Golem', 'Knight'] },
    'Skeleton Army': { role: 'troop', elixir: 3, archetypes: ['Cycle', 'Control'], synergies: ['Giant', 'Golem', 'Knight'] },
    'Goblin Gang': { role: 'troop', elixir: 3, archetypes: ['Cycle', 'Control'], synergies: ['Giant', 'Knight', 'Goblin Barrel'] },
    'Goblins': { role: 'troop', elixir: 2, archetypes: ['Cycle'], synergies: ['Hog Rider', 'Knight', 'Ice Golem'] },
    'Skeletons': { role: 'troop', elixir: 1, archetypes: ['Cycle'], synergies: ['Hog Rider', 'Ice Golem', 'X-Bow'] },
    'Ice Spirit': { role: 'troop', elixir: 1, archetypes: ['Cycle'], synergies: ['Hog Rider', 'Ice Golem', 'X-Bow'] },
    'Fire Spirits': { role: 'troop', elixir: 2, archetypes: ['Cycle'], synergies: ['Hog Rider', 'Knight', 'Ice Golem'] },
    'Barbarians': { role: 'troop', elixir: 5, archetypes: ['Beatdown'], synergies: ['Royal Giant', 'Giant', 'Lava Hound'] },
    'Elite Barbarians': { role: 'troop', elixir: 6, archetypes: ['Beatdown'], synergies: ['Royal Giant', 'Giant', 'Lightning'] },
    'Guards': { role: 'troop', elixir: 3, archetypes: ['Control'], synergies: ['Graveyard', 'Miner', 'Knight'] },
    'Bats': { role: 'troop', elixir: 2, archetypes: ['Cycle'], synergies: ['Hog Rider', 'Knight', 'Ice Golem'] },
    'Minions': { role: 'troop', elixir: 3, archetypes: ['Cycle', 'Beatdown'], synergies: ['Hog Rider', 'Giant', 'Golem'] }
};

// Calculate average elixir cost
function calculateElixirCost(cards) {
    const total = cards.reduce((sum, cardName) => {
        const meta = CARD_METADATA[cardName];
        return sum + (meta ? meta.elixir : 4); // Default to 4 if not found
    }, 0);
    return Math.round((total / 8) * 10) / 10;
}

// Determine deck archetype based on cards
function determineArchetype(cards) {
    const archetypeScores = { Beatdown: 0, Cycle: 0, Control: 0, Siege: 0 };

    cards.forEach(cardName => {
        const meta = CARD_METADATA[cardName];
        if (meta && meta.archetypes) {
            meta.archetypes.forEach(arch => archetypeScores[arch]++);
        }
    });

    const elixir = calculateElixirCost(cards);
    if (elixir < 3.5) archetypeScores.Cycle += 2;
    if (elixir > 4.0) archetypeScores.Beatdown += 1;

    const maxScore = Math.max(...Object.values(archetypeScores));
    const archetype = Object.keys(archetypeScores).find(key => archetypeScores[key] === maxScore);
    return archetype || 'Control';
}

// Card image base URL
const CARD_IMAGE_BASE = 'https://royaleapi.github.io/cr-api-assets/cards/';

function getCardImageUrl(cardName) {
    const formattedName = cardName.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
    return `${CARD_IMAGE_BASE}${formattedName}.png`;
}

function getCardPlaceholderUrl(cardName) {
    // Create a data URI placeholder with card name
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 100, 100);
    gradient.addColorStop(0, '#1a0f0f');
    gradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 100, 100);
    
    // Border
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, 98, 98);
    
    // Text
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 12px Roboto';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split long names
    const words = cardName.split(' ');
    const shortName = words.length > 1 ? words[0].substring(0, 4) : cardName.substring(0, 6);
    ctx.fillText(shortName, 50, 50);
    
    return canvas.toDataURL('image/png');
}

function createCardImage(cardName, altText) {
    const img = document.createElement('img');
    img.src = getCardImageUrl(cardName);
    img.alt = altText || cardName;
    img.loading = 'lazy';
    
    img.onerror = function () {
        // Use placeholder if image fails to load
        this.src = getCardPlaceholderUrl(cardName);
        this.style.backgroundColor = 'rgba(20, 15, 10, 0.8)';
    };
    
    return img;
}

function getCardKey(cardName) {
    // Convert card name to API key format
    return cardName.toUpperCase().replace(/\s+/g, '_');
}

async function fetchPlayerData(playerTag) {
    const tag = playerTag.replace(/^#/, '').replace(/-/g, '');
    // Use API endpoint - works for both local and production
    const url = isProduction ? `/api/player?tag=${tag}` : `${PROXY_URL}/api/player/${tag}`;

    try {
        console.log('Fetching from proxy:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);

            let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

            try {
                const errorData = JSON.parse(errorText);
                if (errorData.reason) {
                    errorMessage = errorData.reason;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.error) {
                    errorMessage = errorData.error;
                }
            } catch (e) {
                errorMessage = errorText || errorMessage;
            }

            // Provide helpful error messages
            if (response.status === 404) {
                errorMessage = 'Player tag not found. Make sure the tag is correct (without #).';
            } else if (response.status === 403) {
                if (isProduction) {
                    errorMessage += ' | API token may need IP whitelisting. Check your developer portal settings.';
                } else {
                    errorMessage += ' | Check if the server is running and your API token is valid.';
                }
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log('Success! Player data:', data);
        return data;

    } catch (error) {
        console.error('API Error:', error);

        // Check if it's a connection error
        if (error.message.includes('Failed to fetch') || error.message.includes('Cannot connect')) {
            if (isProduction) {
                throw new Error('Failed to connect to API. Please try again later.');
            } else {
                throw new Error('Cannot connect to proxy server. Please make sure the server is running. Run "npm start" in your terminal.');
            }
        }

        throw error;
    }
}

function getOwnedCards(playerData) {
    const ownedCards = {};
    const cards = playerData.cards || [];

    cards.forEach(card => {
        if (card.maxLevel > 0) {
            ownedCards[card.name] = {
                level: card.level,
                maxLevel: card.maxLevel,
                id: card.id,
                key: card.key || getCardKey(card.name)
            };
        }
    });

    return ownedCards;
}

function calculateDeckCompatibility(deck, ownedCards) {
    let ownedCount = 0;
    let totalLevel = 0;
    const missingCards = [];

    deck.cards.forEach(cardName => {
        const cardKey = getCardKey(cardName);
        const owned = ownedCards[cardName] || Object.values(ownedCards).find(c =>
            c.key === cardKey || c.name === cardName
        );

        if (owned) {
            ownedCount++;
            totalLevel += owned.level || owned.maxLevel || 1;
        } else {
            missingCards.push(cardName);
        }
    });

    const compatibility = (ownedCount / deck.cards.length) * 100;
    const avgLevel = ownedCount > 0 ? totalLevel / ownedCount : 0;

    // Calculate score: compatibility + level bonus - missing cards penalty
    const score = compatibility + (avgLevel * 2) - (missingCards.length * 5);

    return {
        score: Math.max(0, score),
        compatibility,
        ownedCount,
        totalCards: deck.cards.length,
        missingCards,
        avgLevel: Math.round(avgLevel * 10) / 10
    };
}

function suggestDecks(ownedCards) {
    const deckScores = META_DECKS.map(deck => ({
        ...deck,
        ...calculateDeckCompatibility(deck, ownedCards)
    }));

    // Sort by score (highest first)
    deckScores.sort((a, b) => b.score - a.score);

    // Return top 6 decks
    return deckScores.slice(0, 6);
}

// AI-powered deck generation
function generateAIDecks(ownedCards) {
    const ownedCardNames = Object.keys(ownedCards);
    const generatedDecks = [];

    // Get win conditions from owned cards
    const winConditions = ownedCardNames.filter(card => {
        const meta = CARD_METADATA[card];
        return meta && meta.role === 'winCondition';
    });

    if (winConditions.length === 0) {
        return []; // Can't generate decks without win conditions
    }

    // Generate 3-5 decks based on different win conditions
    const numDecks = Math.min(5, winConditions.length);
    const selectedWinConditions = winConditions.slice(0, numDecks);

    selectedWinConditions.forEach(winCondition => {
        const deck = buildDeckAroundWinCondition(winCondition, ownedCardNames, ownedCards);
        if (deck && deck.cards.length === 8) {
            const compatibility = calculateDeckCompatibility(deck, ownedCards);
            generatedDecks.push({
                ...deck,
                ...compatibility,
                name: `AI ${deck.name}`,
                aiGenerated: true
            });
        }
    });

    // Sort by score (highest first)
    generatedDecks.sort((a, b) => b.score - a.score);

    return generatedDecks.slice(0, 5);
}

function buildDeckAroundWinCondition(winCondition, ownedCards, ownedCardsData) {
    const winMeta = CARD_METADATA[winCondition];
    if (!winMeta) return null;

    const deck = [winCondition];
    const used = new Set([winCondition]);

    // Add synergistic cards
    const synergies = winMeta.synergies || [];
    synergies.forEach(synergy => {
        if (ownedCards.includes(synergy) && !used.has(synergy) && deck.length < 8) {
            deck.push(synergy);
            used.add(synergy);
        }
    });

    // Ensure we have required roles
    const roles = {
        winCondition: 1,
        support: 2,
        spell: 2,
        building: 0,
        tank: 0,
        troop: 0
    };

    // Count existing roles
    deck.forEach(card => {
        const meta = CARD_METADATA[card];
        if (meta && roles.hasOwnProperty(meta.role)) {
            roles[meta.role]--;
        }
    });

    // Fill missing roles
    const sortedOwned = ownedCards.filter(c => !used.has(c)).sort((a, b) => {
        const metaA = CARD_METADATA[a];
        const metaB = CARD_METADATA[b];
        const levelA = ownedCardsData[a]?.level || 1;
        const levelB = ownedCardsData[b]?.level || 1;

        // Prioritize synergistic cards
        const synergyA = synergies.includes(a) ? 10 : 0;
        const synergyB = synergies.includes(b) ? 10 : 0;

        return (synergyB + levelB) - (synergyA + levelA);
    });

    // Add support cards
    while (roles.support > 0 && deck.length < 8) {
        const support = sortedOwned.find(c => {
            const meta = CARD_METADATA[c];
            return meta && meta.role === 'support' && !used.has(c);
        });
        if (support) {
            deck.push(support);
            used.add(support);
            roles.support--;
        } else break;
    }

    // Add spells (need at least 2)
    while (roles.spell > 0 && deck.length < 8) {
        const spell = sortedOwned.find(c => {
            const meta = CARD_METADATA[c];
            return meta && meta.role === 'spell' && !used.has(c);
        });
        if (spell) {
            deck.push(spell);
            used.add(spell);
            roles.spell--;
        } else break;
    }

    // Add building if needed for archetype
    if (winMeta.archetypes.includes('Siege') && deck.length < 8) {
        const building = sortedOwned.find(c => {
            const meta = CARD_METADATA[c];
            return meta && meta.role === 'building' && !used.has(c);
        });
        if (building) {
            deck.push(building);
            used.add(building);
        }
    }

    // Fill remaining slots with best synergies and highest level cards
    while (deck.length < 8) {
        const bestCard = sortedOwned.find(c => !used.has(c));
        if (bestCard) {
            deck.push(bestCard);
            used.add(bestCard);
        } else {
            // If we can't fill with owned cards, try to suggest closest match
            // but still return null if we can't make a viable deck
            break;
        }
    }

    // Only return decks with exactly 8 cards
    if (deck.length !== 8) return null;

    const elixir = calculateElixirCost(deck);
    const type = determineArchetype(deck);

    return {
        cards: deck,
        elixir: elixir,
        type: type,
        name: `${winCondition} Deck`
    };
}

function displayPlayerInfo(playerData) {
    document.getElementById('playerName').textContent = playerData.name || 'Unknown';
    document.getElementById('playerTrophies').textContent = playerData.trophies || 0;
    document.getElementById('playerInfo').classList.remove('hidden');
}

// localStorage functions for recent players
function saveRecentPlayer(playerData) {
    // Extract tag from playerData (API returns tag with #)
    const tag = playerData.tag?.replace(/^#/, '').replace(/-/g, '') || '';
    const name = playerData.name || 'Unknown';
    
    if (!tag) {
        // Try to get tag from the input field if API doesn't return it
        const inputTag = document.getElementById('playerId').value.trim();
        if (inputTag) {
            const finalTag = inputTag.replace(/^#/, '').replace(/-/g, '');
            savePlayerToStorage(finalTag, name);
        }
        return;
    }
    
    savePlayerToStorage(tag, name);
}

function savePlayerToStorage(tag, name) {
    let recentPlayers = getRecentPlayers();
    
    // Remove if already exists
    recentPlayers = recentPlayers.filter(p => p.tag !== tag);
    
    // Add to beginning
    recentPlayers.unshift({
        tag: tag,
        name: name,
        timestamp: Date.now()
    });
    
    // Keep only last 10
    recentPlayers = recentPlayers.slice(0, 10);
    
    localStorage.setItem('clashRoyaleRecentPlayers', JSON.stringify(recentPlayers));
    displayRecentPlayers();
}

function getRecentPlayers() {
    try {
        const stored = localStorage.getItem('clashRoyaleRecentPlayers');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function displayRecentPlayers() {
    const recentPlayers = getRecentPlayers();
    const container = document.getElementById('recentPlayersList');
    const section = document.getElementById('recentPlayers');
    
    if (!container || !section) return;
    
    if (recentPlayers.length === 0) {
        section.classList.add('hidden');
        return;
    }
    
    section.classList.remove('hidden');
    container.innerHTML = '';
    
    recentPlayers.forEach((player, index) => {
        const playerBtn = document.createElement('button');
        playerBtn.className = 'recent-player-btn';
        playerBtn.innerHTML = `
            <span class="recent-player-name">${escapeHtml(player.name)}</span>
            <span class="recent-player-tag">#${player.tag}</span>
        `;
        
        playerBtn.addEventListener('click', () => {
            document.getElementById('playerId').value = player.tag;
            document.getElementById('fetchBtn').click();
        });
        
        container.appendChild(playerBtn);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function clearRecentPlayers() {
    localStorage.removeItem('clashRoyaleRecentPlayers');
    displayRecentPlayers();
}

// Store owned cards globally
let ownedCards = {};
let allOwnedCards = {}; // Store original for filtering

function sortAndFilterCards(cards, sortBy, filterBy) {
    let filtered = Object.entries(cards);

    // Apply filter
    if (filterBy !== 'all') {
        filtered = filtered.filter(([name, card]) => {
            const meta = CARD_METADATA[name];
            return meta && meta.role === filterBy;
        });
    }

    // Apply sorting
    filtered.sort(([nameA, cardA], [nameB, cardB]) => {
        const metaA = CARD_METADATA[nameA] || {};
        const metaB = CARD_METADATA[nameB] || {};
        const levelA = cardA.level || cardA.maxLevel || 1;
        const levelB = cardB.level || cardB.maxLevel || 1;
        const elixirA = metaA.elixir || 4;
        const elixirB = metaB.elixir || 4;
        const roleA = metaA.role || '';
        const roleB = metaB.role || '';

        switch (sortBy) {
            case 'name':
                return nameA.localeCompare(nameB);
            case 'level':
                return levelB - levelA; // High to Low
            case 'levelAsc':
                return levelA - levelB; // Low to High
            case 'elixir':
                return elixirB - elixirA; // High to Low
            case 'elixirAsc':
                return elixirA - elixirB; // Low to High
            case 'role':
                if (roleA !== roleB) {
                    return roleA.localeCompare(roleB);
                }
                return nameA.localeCompare(nameB);
            default:
                return nameA.localeCompare(nameB);
        }
    });

    return filtered;
}

function displayOwnedCards(ownedCards, sortBy = 'name', filterBy = 'all') {
    const container = document.getElementById('cardsContainer');
    container.innerHTML = '';

    const sortedAndFiltered = sortAndFilterCards(ownedCards, sortBy, filterBy);

    // Update card count
    const countDiv = document.getElementById('cardCount');
    countDiv.textContent = `Showing ${sortedAndFiltered.length} of ${Object.keys(ownedCards).length} cards`;

    if (sortedAndFiltered.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: #666;">No cards match your filter criteria.</p>';
        document.getElementById('ownedCards').classList.remove('hidden');
        return;
    }

    sortedAndFiltered.forEach(([name, card]) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'owned-card-item';
        cardDiv.setAttribute('data-card-name', name);
        cardDiv.title = name; // Fallback tooltip

        // Add role badge if available
        const meta = CARD_METADATA[name];
        if (meta && meta.role) {
            cardDiv.setAttribute('data-role', meta.role);
        }
        if (meta && meta.elixir) {
            cardDiv.setAttribute('data-elixir', meta.elixir);
        }

        const img = createCardImage(name, name);

        const levelSpan = document.createElement('span');
        levelSpan.className = 'card-level';
        levelSpan.textContent = `Lv.${card.level || card.maxLevel}`;

        // Add elixir cost badge
        if (meta && meta.elixir) {
            const elixirSpan = document.createElement('span');
            elixirSpan.className = 'card-elixir';
            elixirSpan.textContent = meta.elixir;
            cardDiv.appendChild(elixirSpan);
        }

        cardDiv.appendChild(img);
        cardDiv.appendChild(levelSpan);
        container.appendChild(cardDiv);
    });

    document.getElementById('ownedCards').classList.remove('hidden');
}

function displayDecks(decks) {
    const container = document.getElementById('decksContainer');
    container.innerHTML = '';

    decks.forEach((deck, index) => {
        const deckCard = document.createElement('div');
        deckCard.className = 'deck-card';

        const header = document.createElement('div');
        header.className = 'deck-header';

        const title = document.createElement('h3');
        title.className = 'deck-title';
        title.textContent = deck.name;

        const rating = document.createElement('div');
        rating.className = 'deck-rating';
        const compatibility = Math.round(deck.compatibility);
        rating.textContent = `${compatibility}% Compatible`;

        if (compatibility === 100) {
            rating.textContent += ' - Perfect Match!';
            rating.style.color = '#4CAF50';
        }

        header.appendChild(title);
        header.appendChild(rating);

        const cardsGrid = document.createElement('div');
        cardsGrid.className = 'deck-cards';

        deck.cards.forEach(cardName => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card-item';
            cardDiv.setAttribute('data-card-name', cardName);
            cardDiv.title = cardName; // Fallback tooltip

            const img = createCardImage(cardName, cardName);

            const owned = ownedCards[cardName];
            if (owned) {
                const levelSpan = document.createElement('span');
                levelSpan.className = 'card-level';
                levelSpan.textContent = `Lv.${owned.level || owned.maxLevel}`;
                cardDiv.appendChild(levelSpan);
                cardDiv.style.borderColor = '#4CAF50';
            } else {
                cardDiv.style.opacity = '0.5';
                cardDiv.style.borderColor = '#ff6b6b';
            }

            cardDiv.appendChild(img);
            cardsGrid.appendChild(cardDiv);
        });

        const stats = document.createElement('div');
        stats.className = 'deck-stats';
        stats.innerHTML = `
            <span>Avg Elixir: ${deck.elixir}</span>
            <span>Type: ${deck.type}</span>
            <span>Owned: ${deck.ownedCount}/${deck.totalCards}</span>
        `;

        if (deck.missingCards.length > 0) {
            const missing = document.createElement('div');
            missing.style.marginTop = '10px';
            missing.style.fontSize = '0.85rem';
            missing.style.color = '#ff6b6b';
            missing.textContent = `Missing: ${deck.missingCards.join(', ')}`;
            stats.appendChild(missing);
        }

        deckCard.appendChild(header);
        deckCard.appendChild(cardsGrid);
        deckCard.appendChild(stats);
        container.appendChild(deckCard);
    });

    document.getElementById('deckSuggestions').classList.remove('hidden');
}

function displayAIDecks(decks, ownedCards) {
    const container = document.getElementById('aiDecksContainer');
    container.innerHTML = '';

    if (decks.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #d4af37; padding: 20px; font-weight: 600;">No AI recommendations available. Make sure you own at least one win condition card.</p>';
        document.getElementById('aiSuggestions').classList.remove('hidden');
        return;
    }

    decks.forEach((deck, index) => {
        const deckCard = document.createElement('div');
        deckCard.className = 'deck-card ai-deck-card';

        const header = document.createElement('div');
        header.className = 'deck-header';

        const title = document.createElement('h3');
        title.className = 'deck-title';
        title.textContent = deck.name;

        const aiBadge = document.createElement('span');
        aiBadge.className = 'ai-badge';
        aiBadge.textContent = 'AI';
        title.appendChild(aiBadge);

        const rating = document.createElement('div');
        rating.className = 'deck-rating';
        const compatibility = Math.round(deck.compatibility);
        rating.textContent = `${compatibility}% Compatible`;

        if (compatibility === 100) {
            rating.textContent += ' - Perfect Match!';
            rating.style.color = '#4CAF50';
        } else if (compatibility >= 87.5) {
            rating.style.color = '#4CAF50';
        }

        header.appendChild(title);
        header.appendChild(rating);

        const cardsGrid = document.createElement('div');
        cardsGrid.className = 'deck-cards';

        deck.cards.forEach(cardName => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card-item';
            cardDiv.setAttribute('data-card-name', cardName);
            cardDiv.title = cardName;

            const img = createCardImage(cardName, cardName);

            const owned = ownedCards[cardName];
            if (owned) {
                const levelSpan = document.createElement('span');
                levelSpan.className = 'card-level';
                levelSpan.textContent = `Lv.${owned.level || owned.maxLevel}`;
                cardDiv.appendChild(levelSpan);
                cardDiv.style.borderColor = '#4CAF50';
            } else {
                cardDiv.style.opacity = '0.5';
                cardDiv.style.borderColor = '#ff6b6b';
            }

            cardDiv.appendChild(img);
            cardsGrid.appendChild(cardDiv);
        });

        const stats = document.createElement('div');
        stats.className = 'deck-stats';
        stats.innerHTML = `
            <span>Avg Elixir: ${deck.elixir}</span>
            <span>Type: ${deck.type}</span>
            <span>Owned: ${deck.ownedCount}/${deck.totalCards}</span>
        `;

        if (deck.missingCards.length > 0) {
            const missing = document.createElement('div');
            missing.style.marginTop = '10px';
            missing.style.fontSize = '0.85rem';
            missing.style.color = '#ff6b6b';
            missing.textContent = `Missing: ${deck.missingCards.join(', ')}`;
            stats.appendChild(missing);
        }

        deckCard.appendChild(header);
        deckCard.appendChild(cardsGrid);
        deckCard.appendChild(stats);
        container.appendChild(deckCard);
    });

    document.getElementById('aiSuggestions').classList.remove('hidden');
}

document.getElementById('fetchBtn').addEventListener('click', async () => {
    const playerTag = document.getElementById('playerId').value.trim();

    if (!playerTag) {
        alert('Please enter your player tag');
        return;
    }

    // Hide previous results
    document.getElementById('error').classList.add('hidden');
    document.getElementById('playerInfo').classList.add('hidden');
    document.getElementById('deckSuggestions').classList.add('hidden');
    document.getElementById('aiSuggestions').classList.add('hidden');
    document.getElementById('ownedCards').classList.add('hidden');
    document.getElementById('loading').classList.remove('hidden');

    try {
        const playerData = await fetchPlayerData(playerTag);
        ownedCards = getOwnedCards(playerData);
        allOwnedCards = { ...ownedCards }; // Store copy for filtering

        displayPlayerInfo(playerData);
        
        // Save player tag to playerData if not present
        if (!playerData.tag) {
            playerData.tag = `#${tag}`;
        }
        
        saveRecentPlayer(playerData);
        displayOwnedCards(ownedCards);

        // Display meta decks
        const suggestedDecks = suggestDecks(ownedCards);
        displayDecks(suggestedDecks);

        // Generate and display AI recommendations
        const aiDecks = generateAIDecks(ownedCards);
        displayAIDecks(aiDecks, ownedCards);

    } catch (error) {
        console.error('Error:', error);
        const errorDiv = document.getElementById('error');
        let errorMessage = error.message || 'Failed to fetch player data.';

        // Provide helpful error messages
        if (errorMessage.includes('403')) {
            errorMessage += ' The API token may need IP whitelisting. Check your developer portal settings.';
        } else if (errorMessage.includes('404')) {
            errorMessage += ' Player tag not found. Make sure the tag is correct (without #).';
        } else if (errorMessage.includes('CORS')) {
            errorMessage += ' Try running this from a local server or use a backend proxy.';
        }

        errorDiv.textContent = `Error: ${errorMessage}`;
        errorDiv.classList.remove('hidden');
    } finally {
        document.getElementById('loading').classList.add('hidden');
    }
});

// Allow Enter key to submit
document.getElementById('playerId').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('fetchBtn').click();
    }
});

// Filter and sort controls
document.getElementById('sortBy').addEventListener('change', () => {
    const sortBy = document.getElementById('sortBy').value;
    const filterBy = document.getElementById('filterBy').value;
    displayOwnedCards(allOwnedCards, sortBy, filterBy);
});

document.getElementById('filterBy').addEventListener('change', () => {
    const sortBy = document.getElementById('sortBy').value;
    const filterBy = document.getElementById('filterBy').value;
    displayOwnedCards(allOwnedCards, sortBy, filterBy);
});

document.getElementById('resetFilters').addEventListener('click', () => {
    document.getElementById('sortBy').value = 'name';
    document.getElementById('filterBy').value = 'all';
    displayOwnedCards(allOwnedCards, 'name', 'all');
});

// Load recent players on page load
document.addEventListener('DOMContentLoaded', () => {
    displayRecentPlayers();
});

