**RoomReel Challenge - UI Copy and User Journey**

---

## Overall Concept

**Goal:** Encourage current students in UK, US, Canada, AUS, and Ireland to create short video reels about their real student living experience through gamified challenges. These reels will be used to inspire new joiners before September admissions.

**Core Features:**

* Limited-time challenges to create urgency and FOMO
* Users pick 5 prompts from a set of challenge-specific prompts
* Guided camera overlay experience for each clip
* Reward spin after completing all 5

---

## Challenge Example: "My Room, My Vibe"

### 1. Challenge Gallery Card (Landing)

* **Title:** My Room, My Vibe
* **Tagline:** Show what makes your space feel like home
* **Label:** 🎮 5 Scenes · ⏳ 3 Days Left
* **CTA:** Start Challenge

---

### 2. Challenge Details + Prompt Picker

* **Title:** Pick Your 5 Prompts

* **Subtitle:** Help the next student imagine living here — we’ll guide you with quick clips.

* **Prompt List (multi-select):**

  * Show your favorite corner in the room 🏩
  * What’s your study setup like? 🎧
  * Take us to your kitchen – what do you cook most? 🍜
  * What’s your view like from the window? 🌇
  * Say one thing you love most about living here ❤️
  * What’s in your fridge? 🧃
  * A roommate shoutout 👋
  * Your chill-out zone 🧘

* **Button:** 🎥 Let’s Start Recording

---

### 3. Recording Prompts (repeats 5x)

* **Overlay Prompt:**

  * Prompt 1 of 5: “Show your favorite corner in the room 🏩”
* **Next Prompt Preview:**

  * Up next: “Study setup 🎧”
* **After Each Clip:**

  * ✅ “That’ll really help someone feel what it’s like!”
  * 🏱 “+10 points unlocked!”

---

### 4. Final Preview

* **Header:** 🎞️ Your Reel Is Ready!
* **Text:** Looks good! Ready to share your RoomReel and win a reward?
* **Buttons:**

  * Preview
  * Submit & Spin

---

### 5. Spin Wheel

* **Header:** 🌡️ Spin to Win!
* **Text:** You completed “My Room, My Vibe” — here's your reward!
* **Prizes:**

  * Starbucks ☕
  * Gym Trial 💪
  * Spotify 1-Month 🎧
  * Feature Me on IG 🌟
  * Grocery Voucher 🛒
  * Surprise 🏰

---

### 6. Post-Submission

* **Header:** 🚀 You’re Live!
* **Text:** Your reel’s uploaded — your story can help someone book with confidence.
* **Buttons:**

  * Share My Reel
  * Try Another Challenge
  * View Leaderboard (optional)

---

## Additional Challenge Templates

### 1. A Day in the Life

* **Tagline:** What’s your student life really like?
* **Prompts (pick 5):**

  * Your morning routine 🚱
  * Uni walk or commute 🏃‍♂️
  * What’s for lunch? 🍱
  * Where do you hang out post-classes? 🧳
  * Study grind moment 💻
  * Chill time in the evening 🌯
  * Something unexpected today! 🎉
  * Night-time view 🌙

---

### 2. Flatmates Say...

* **Tagline:** What do your flatmates love (or roast) about living here?
* **Prompts (pick 5):**

  * Everyone introduce themselves 👋
  * One word to describe this flat 🤭
  * Who’s the messy one? 🦜
  * What’s the best shared moment? 📸
  * Group tour of kitchen/dining 🥣
  * “Would you recommend this place?” 💯

---

### 3. Neighborhood Hacks

* **Tagline:** Tips for surviving (and thriving) in your student city
* **Prompts (pick 5):**

  * Cheapest grocery? 🛒
  * Favorite nearby hangout? 🎮
  * Coffee or breakfast spot? ☕
  * Study spot outside your room? 📚
  * Hidden gems? 🗺️
  * Safest route back home? 🚶
  * One thing you wish you knew earlier 🎯

---

### 4. What I Wish I Knew

* **Tagline:** Reflect, rant, or review — it all helps someone else
* **Prompts (pick 5):**

  * What surprised you the most here? 😮
  * What was hard to get used to? 😵
  * A weird rule or policy here 🗒️
  * Most useful thing you packed 🎒
  * Most useless thing you brought 🛫
  * One big tip for a new resident 🔑

---

## Challenge Definition Format (JSON-like)

```json
{
  "id": "my-room-my-vibe",
  "title": "My Room, My Vibe",
  "tagline": "Show what makes your space feel like home",
  "duration_days": 3,
  "max_prompts": 5,
  "prompt_pool": [
    "Show your favorite corner in the room 🏩",
    "What’s your study setup like? 🎧",
    "Take us to your kitchen – what do you cook? 🍜",
    "What’s your view like from the window? 🌇",
    "Say one thing you love most about living here ❤️",
    "What’s in your fridge? 🧃",
    "A roommate shoutout 👋",
    "Your chill-out zone 🧘"
  ],
  "rewards": [
    "Starbucks voucher",
    "Spotify 1-month",
    "Gym trial",
    "Grocery discount",
    "IG feature badge",
    "Mystery box"
  ]
}
```

---

Let me know if you want this exported as PDF, shared as Notion doc, or translated into a Figma wireframe flow.
