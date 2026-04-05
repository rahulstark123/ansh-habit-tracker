const MINDSET_QUOTES = [
  { text: "We are what we repeatedly do. Excellence, then, is not an act but a habit.", author: "Aristotle" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "When something is important enough, you do it even if the odds are not in your favor.", author: "Elon Musk" },
  { text: "Do not watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Well done is better than well said.", author: "Benjamin Franklin" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi" },
  { text: "Dreams do not work unless you do.", author: "John C. Maxwell" },
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "The best way out is always through.", author: "Robert Frost" },
  { text: "Whether you think you can, or you think you cannot, you are right.", author: "Henry Ford" },
  { text: "Try not to become a person of success, but rather a person of value.", author: "Albert Einstein" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Success is where preparation and opportunity meet.", author: "Bobby Unser" },
  { text: "Great acts are made up of small deeds.", author: "Lao Tzu" },
  { text: "To improve is to change; to be perfect is to change often.", author: "Winston Churchill" },
  { text: "Consistency is what transforms average into excellence.", author: "Tony Robbins" },
  { text: "You miss one hundred percent of the shots you do not take.", author: "Wayne Gretzky" },
  { text: "Hard choices, easy life. Easy choices, hard life.", author: "Jerzy Gregorek" },
  { text: "The cost of discipline is always less than the pain of regret.", author: "Navy SEAL saying" },
  { text: "If you are going through hell, keep going.", author: "Winston Churchill" },
  { text: "The obstacle is the way.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing what a good person should be. Be one.", author: "Marcus Aurelius" },
  { text: "Fortune favors the bold.", author: "Virgil" },
  { text: "What gets measured gets managed.", author: "Peter Drucker" },
  { text: "The first principle is that you must not fool yourself.", author: "Richard Feynman" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" }
];

export function getQuoteOfTheDay(date = new Date()) {
  const localMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayNumber = Math.floor(localMidnight.getTime() / 86400000);
  const index = Math.abs(dayNumber) % MINDSET_QUOTES.length;
  return MINDSET_QUOTES[index];
}
