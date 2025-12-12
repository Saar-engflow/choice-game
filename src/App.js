import React, { useState, useEffect } from 'react';
import { Heart, Skull, Smartphone, DollarSign, Users, Home } from 'lucide-react';
import { generateStorySegment } from './deepseekService';
import './styles.css';

const ChoicesGame = () => {
  const [currentNode, setCurrentNode] = useState(null);
  const [displayText, setDisplayText] = useState('');
  const [showChoices, setShowChoices] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    relationships: 50,
    money: 30,
    mental: 50,
    reputation: 50
  });
  const [storyHistory, setStoryHistory] = useState([]);
  const [currentStory, setCurrentStory] = useState('');

  // MASSIVE STORY NETWORK - All interconnected
  const storyNodes = {
    start1: {
      text: "your phone lights up at 3am. it's your ex. 'i miss you' they text. you know they're with someone else now. your heart races.",
      icon: Heart,
      choices: [
        { text: "reply 'miss u too'", next: 'ex_reply', stats: { mental: -10, reputation: -5 } },
        { text: "block them finally", next: 'block_ex', stats: { mental: +15, relationships: -10 } },
        { text: "screenshot and send to bestie", next: 'screenshot_drama', stats: { reputation: +5 } }
      ]
    },
    
    start2: {
      text: "mom finds K500 in your pocket. 'where did this come from?' she asks. you stole it from dad's wallet last week to buy data bundles.",
      icon: DollarSign,
      choices: [
        { text: "tell the truth", next: 'truth_consequences', stats: { mental: +10, relationships: -15 } },
        { text: "say a friend paid back a debt", next: 'lie_to_mom', stats: { mental: -15, relationships: +5 } },
        { text: "run out of the house", next: 'run_away', stats: { mental: -20, relationships: -25 } }
      ]
    },

    start3: {
      text: "your crush posts a story. they're at a party you weren't invited to. with THAT person. the one they said was 'just a friend'.",
      icon: Smartphone,
      choices: [
        { text: "post your own thirst trap", next: 'revenge_post', stats: { reputation: +10, mental: -5 } },
        { text: "text them 'having fun?'", next: 'passive_aggressive', stats: { mental: -10 } },
        { text: "delete instagram and cry", next: 'delete_socials', stats: { mental: -15, reputation: -10 } }
      ]
    },

    start4: {
      text: "dad lost his job. again. he's drinking in the living room. mom is crying in the bedroom. your siblings are hungry. you have K200.",
      icon: Home,
      choices: [
        { text: "buy food for everyone", next: 'feed_family', stats: { money: -20, relationships: +20 } },
        { text: "keep the money, pretend you're broke", next: 'keep_money', stats: { money: +20, mental: -20, relationships: -15 } },
        { text: "give K100, keep K100", next: 'split_money', stats: { money: -10, relationships: +10, mental: -5 } }
      ]
    },

    start5: {
      text: "your best friend just confessed they're in love with you. you've known for months. you don't feel the same way. they're crying.",
      icon: Users,
      choices: [
        { text: "say 'i love you too' (lie)", next: 'fake_love', stats: { mental: -25, relationships: +10 } },
        { text: "reject them honestly", next: 'honest_rejection', stats: { mental: +10, relationships: -20 } },
        { text: "ghost them forever", next: 'ghost_bestie', stats: { mental: -15, relationships: -30, reputation: -15 } }
      ]
    },

    start6: {
      text: "you failed your grade 12 exams. everyone expected you to pass. your parents paid for extra lessons. your friends are celebrating their results.",
      icon: Skull,
      choices: [
        { text: "tell your parents immediately", next: 'confess_failure', stats: { mental: -10, relationships: -15 } },
        { text: "fake your results paper", next: 'forge_results', stats: { mental: -30, relationships: +5 } },
        { text: "disappear for a few days", next: 'run_away', stats: { mental: -20, relationships: -20 } }
      ]
    },

    // CONTINUATION NODES
    ex_reply: {
      text: "you text back. they read it instantly. three dots appear... then disappear. 5 minutes pass. no reply. you feel stupid.",
      icon: Heart,
      choices: [
        { text: "double text 'wyd?'", next: 'desperate_double', stats: { mental: -15, reputation: -10 } },
        { text: "unsend the message", next: 'unsend_shame', stats: { mental: -5 } },
        { text: "post a sad song lyric", next: 'sad_post', stats: { reputation: -5 } }
      ]
    },

    block_ex: {
      text: "you block them. finally. you feel... lighter? but also empty. your finger hovers over 'unblock'. don't do it. don't do it.",
      icon: Heart,
      choices: [
        { text: "unblock them 'just to check'", next: 'weak_moment', stats: { mental: -20, relationships: -10 } },
        { text: "delete their number completely", next: 'full_delete', stats: { mental: +20, relationships: -15 } },
        { text: "check their profile from fake account", next: 'stalker_mode', stats: { mental: -10, reputation: -5 } }
      ]
    },

    screenshot_drama: {
      text: "your bestie replies: 'LMAOOO they're so down bad 💀💀💀 what you gonna do?' you laugh but your chest still hurts.",
      icon: Smartphone,
      choices: [
        { text: "send a savage reply to your ex", next: 'savage_reply', stats: { reputation: +15, mental: +5 } },
        { text: "admit you still have feelings", next: 'vulnerable_moment', stats: { mental: +10, relationships: +5 } },
        { text: "post the screenshot on your story", next: 'public_drama', stats: { reputation: +20, mental: -10, relationships: -25 } }
      ]
    },

    truth_consequences: {
      text: "mom's face breaks. 'you STOLE from your own father?' she's crying now. dad walks in. he heard everything. his belt is already in his hand.",
      icon: Home,
      choices: [
        { text: "take the beating silently", next: 'accept_punishment', stats: { mental: -15, relationships: +10 } },
        { text: "fight back and shout", next: 'family_fight', stats: { mental: -20, relationships: -30 } },
        { text: "apologize and promise to pay back", next: 'redemption_arc', stats: { money: -10, relationships: +15 } }
      ]
    },

    lie_to_mom: {
      text: "she believes you. but you see the doubt in her eyes. she knows. she always knows. but she's choosing to trust you anyway. that hurts more.",
      icon: DollarSign,
      choices: [
        { text: "actually pay dad back secretly", next: 'secret_repay', stats: { money: -20, mental: +15 } },
        { text: "spend it on airtime anyway", next: 'selfish_choice', stats: { money: -5, mental: -10, relationships: -5 } },
        { text: "confess the truth tomorrow", next: 'delayed_truth', stats: { mental: +5 } }
      ]
    },

    run_away: {
      text: "you're at the bus station. K87 in your pocket. no plan. just anywhere but home. a bus to livingstone leaves in 10 minutes.",
      icon: Skull,
      choices: [
        { text: "buy the ticket. leave everything.", next: 'bus_escape', stats: { money: -30, relationships: -40, mental: -25 } },
        { text: "call your cousin in town", next: 'cousin_help', stats: { relationships: +10, mental: -5 } },
        { text: "go back home", next: 'return_home', stats: { mental: +15, relationships: -10 } }
      ]
    },

    revenge_post: {
      text: "you post the hottest pic from your gallery. 15 likes in 2 minutes. 30 likes. 50. your crush views it. no reaction. just viewed.",
      icon: Smartphone,
      choices: [
        { text: "post another one", next: 'thirst_trap_spiral', stats: { reputation: +15, mental: -15 } },
        { text: "delete it out of embarrassment", next: 'delete_shame', stats: { reputation: -15, mental: -10 } },
        { text: "dm them 'like what you see?'", next: 'bold_dm', stats: { mental: -5, reputation: +10 } }
      ]
    },

    feed_family: {
      text: "you buy nshima, chicken, and vegetables. your siblings' faces light up. mom hugs you. dad doesn't look at you. you're broke now but everyone eats tonight.",
      icon: Home,
      choices: [
        { text: "ask dad if he's okay", next: 'talk_to_dad', stats: { relationships: +15, mental: +10 } },
        { text: "eat silently and go to your room", next: 'isolate_self', stats: { mental: -5 } },
        { text: "joke to lighten the mood", next: 'family_laughter', stats: { relationships: +20, mental: +15 } }
      ]
    },

    fake_love: {
      text: "you kiss them. they're ecstatic. you feel nothing. now you're in a relationship you don't want. but they're so happy. how long can you keep this up?",
      icon: Heart,
      choices: [
        { text: "try to make it work genuinely", next: 'force_feelings', stats: { mental: -20, relationships: +15 } },
        { text: "cheat to sabotage it", next: 'self_sabotage', stats: { mental: -30, relationships: -40, reputation: -25 } },
        { text: "break up after 2 weeks", next: 'delayed_breakup', stats: { mental: -15, relationships: -25 } }
      ]
    },

    honest_rejection: {
      text: "'i'm sorry. i love you but not like that.' they leave. no words. just tears. you watch them go. you lost your best friend. but you were honest.",
      icon: Users,
      choices: [
        { text: "text them apologies all night", next: 'apologize_spam', stats: { mental: -10, relationships: -5 } },
        { text: "give them space", next: 'respectful_space', stats: { mental: +10, relationships: +5 } },
        { text: "try to be friends immediately", next: 'force_friendship', starts: { mental: -15, relationships: -15 } }
      ]
    },

    // DEEP NODES
    desperate_double: {
      text: "'wyd?' you sent it. left on read. 2 hours later they post a story. they're at a party. laughing. with someone else. you're home. alone. crying.",
      icon: Skull,
      choices: [
        { text: "call them 15 times", next: 'psycho_calls', stats: { mental: -30, reputation: -20, relationships: -35 } },
        { text: "smoke weed to forget", next: 'substance_escape', stats: { mental: -25, money: -10 } },
        { text: "journal your feelings", next: 'healthy_coping', stats: { mental: +20 } }
      ]
    },

    full_delete: {
      text: "their number is gone. contacts. chats. photos. everything. you feel... free. scared. empty. all at once. your phone feels lighter. so does your chest. maybe.",
      icon: Heart,
      choices: [
        { text: "focus on yourself finally", next: 'self_improvement', stats: { mental: +30, reputation: +10 } },
        { text: "download tinder", next: 'rebound_hunt', stats: { mental: -10, reputation: +5 } },
        { text: "write them a letter you'll never send", next: 'unsent_letter', stats: { mental: +15 } }
      ]
    },

    savage_reply: {
      text: "you send: 'sorry i don't speak to people who downgraded 💅' they block you. your friends are dying laughing. you're laughing too. but alone at night you cry.",
      icon: Smartphone,
      choices: [
        { text: "post it on your story as a W", next: 'victory_post', stats: { reputation: +25, mental: -15 } },
        { text: "regret it immediately", next: 'instant_regret', stats: { mental: -20 } },
        { text: "commit to the savage era", next: 'villain_arc', stats: { reputation: +20, mental: -10, relationships: -15 } }
      ]
    },

    accept_punishment: {
      text: "the belt hits. once. twice. ten times. you don't cry. won't give him the satisfaction. mom tries to stop him. he pushes her away. you're bleeding.",
      icon: Skull,
      choices: [
        { text: "report him to police", next: 'police_report', stats: { relationships: -50, mental: +10 } },
        { text: "run away tonight", next: 'midnight_escape', stats: { money: -10, relationships: -30, mental: -20 } },
        { text: "forgive and stay", next: 'cycle_continues', stats: { mental: -25, relationships: +5 } }
      ]
    },

    bus_escape: {
      text: "you're on the bus. lusaka fades behind you. no goodbye. no note. just gone. your phone has 47 missed calls. you turn it off. freedom? or running?",
      icon: Skull,
      choices: [
        { text: "start fresh in livingstone", next: 'new_beginning', stats: { mental: +20, relationships: -40, money: -30 } },
        { text: "get off at the next stop", next: 'change_mind', stats: { mental: -10, money: -15 } },
        { text: "call mom crying", next: 'breakdown_call', stats: { mental: -15, relationships: +10 } }
      ]
    },

    thirst_trap_spiral: {
      text: "post 2. post 3. post 4. each one more desperate than the last. your friends are worried. your crush still hasn't dmed. you look pathetic.",
      icon: Smartphone,
      choices: [
        { text: "delete everything in shame", next: 'social_media_break', stats: { reputation: -20, mental: +10 } },
        { text: "double down. bikini pic.", next: 'rock_bottom', stats: { reputation: -30, mental: -25 } },
        { text: "post 'felt cute might delete'", next: 'damage_control', stats: { reputation: -5 } }
      ]
    },

    talk_to_dad: {
      text: "'dad... you okay?' he looks up. eyes red. 'i'm sorry son. i failed you all.' he's crying. your dad. crying. you've never seen this.",
      icon: Home,
      choices: [
        { text: "hug him", next: 'father_son_moment', stats: { relationships: +30, mental: +25 } },
        { text: "tell him it's not his fault", next: 'comfort_dad', stats: { relationships: +25, mental: +15 } },
        { text: "promise to help provide", next: 'responsibility_taken', stats: { relationships: +20, mental: -10, money: -20 } }
      ]
    },

    self_improvement: {
      text: "you join a gym. start reading. learn to cook. focus on school. 3 months later you're glowing. your ex watches your story every day. no reply. just watches.",
      icon: Heart,
      choices: [
        { text: "post 'thank u next energy'", next: 'glow_up_post', stats: { reputation: +30, mental: +25 } },
        { text: "keep grinding silently", next: 'silent_winner', stats: { mental: +35, reputation: +20 } },
        { text: "dm them 'see what you lost?'", next: 'petty_message', stats: { mental: -15, reputation: +10 } }
      ]
    },

    villain_arc: {
      text: "you become THAT person. savage replies. leaving people on read. playing games. your reputation is 'heartbreaker'. it feels powerful. but you're so lonely.",
      icon: Skull,
      choices: [
        { text: "own it fully", next: 'embrace_chaos', stats: { reputation: +25, mental: -30, relationships: -40 } },
        { text: "apologize to people you've hurt", next: 'redemption_seek', stats: { mental: +20, reputation: -10, relationships: +15 } },
        { text: "keep pretending until you believe it", next: 'fake_it', stats: { mental: -35, reputation: +15 } }
      ]
    },

    father_son_moment: {
      text: "you hug your dad. he breaks down completely. sobs into your shoulder. 'we'll be okay dad. i promise.' he holds you tighter. 'you're the man now, son.'",
      icon: Home,
      choices: [
        { text: "cry together", next: 'family_healing', stats: { mental: +30, relationships: +40 } },
        { text: "plan how to survive together", next: 'family_strategy', stats: { mental: +20, relationships: +35, money: +10 } },
        { text: "tell him about your dreams", next: 'vulnerable_share', stats: { mental: +25, relationships: +30 } }
      ]
    },

    new_beginning: {
      text: "livingstone. tourist capital. you're broke. alone. scared. but... free? you sleep on the street the first night. k47 left. this better be worth it.",
      icon: Skull,
      choices: [
        { text: "look for piece jobs at victoria falls", next: 'hustle_begins', stats: { money: +20, mental: +10 } },
        { text: "call home and beg to return", next: 'pride_swallowed', stats: { mental: -15, relationships: +5 } },
        { text: "befriend street kids", next: 'street_family', stats: { relationships: +15, money: -10, mental: -5 } }
      ]
    },

    family_healing: {
      text: "that night changed everything. dad found another job. mom smiles more. you all eat together now. talk. laugh. it's not perfect but it's... home. real home.",
      icon: Heart,
      choices: [
        { text: "appreciate this moment", next: 'gratitude_ending', stats: { mental: +40, relationships: +50 } },
        { text: "work hard to keep it this way", next: 'maintain_peace', stats: { mental: +35, money: +15, relationships: +40 } },
        { text: "pray this lasts forever", next: 'hopeful_ending', stats: { mental: +45, relationships: +45 } }
      ]
    },

    // ENDING NODES
    gratitude_ending: {
      text: "you realize: life isn't about perfect. it's about moments. this moment. this family. this love. you're exactly where you need to be. finally. peace.",
      icon: Heart,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    },

    embrace_chaos: {
      text: "you're the villain in everyone's story now. your DMs are full. your heart is empty. your reputation is legendary. but when you're alone... you're so fucking alone.",
      icon: Skull,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    },

    silent_winner: {
      text: "6 months later: new body. new grades. new energy. you don't post. you don't brag. you just... win. people notice. especially your ex. but you don't care anymore. growth.",
      icon: Heart,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    },

    hustle_begins: {
      text: "you carry bags for tourists. k5 here. k10 there. sleep under the bridge. wake up. hustle again. it's hard. brutal. but it's yours. you're building something. slowly.",
      icon: DollarSign,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    },

    cycle_continues: {
      text: "you forgive him. stay. it happens again. and again. you're trapped. you know it. but this is family. this is home. this is... all you know. maybe one day. maybe.",
      icon: Skull,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    },

    // NEW STORY NODES
    start7: {
      text: "your teacher catches you cheating on the exam. the whole class is watching. your parents paid for private lessons. this could ruin everything.",
      icon: Skull,
      choices: [
        { text: "deny everything", next: 'deny_cheating', stats: { mental: -20, reputation: -15 } },
        { text: "admit and beg for mercy", next: 'beg_teacher', stats: { mental: -10, reputation: -10 } },
        { text: "walk out of the exam hall", next: 'walk_out', stats: { mental: -25, reputation: -30 } }
      ]
    },

    start8: {
      text: "you find your sister's diary. she's been cutting herself. writing about how much she hates herself. how she's worthless. you never knew.",
      icon: Heart,
      choices: [
        { text: "confront her immediately", next: 'confront_sister', stats: { relationships: +15, mental: -5 } },
        { text: "tell your parents", next: 'tell_parents_secret', stats: { relationships: -10, mental: +5 } },
        { text: "pretend you never saw it", next: 'ignore_secret', stats: { mental: -15, relationships: -20 } }
      ]
    },

    start9: {
      text: "your best friend is moving away tomorrow. they've been your rock through everything. now they're leaving. you can't imagine life without them.",
      icon: Users,
      choices: [
        { text: "throw them a surprise party", next: 'surprise_party', stats: { money: -15, relationships: +25, mental: +10 } },
        { text: "spend the day together quietly", next: 'quiet_goodbye', stats: { relationships: +20, mental: +15 } },
        { text: "act normal, pretend it doesn't hurt", next: 'fake_normal', stats: { mental: -20, relationships: -5 } }
      ]
    },

    start10: {
      text: "you wake up in a hospital bed. last night you drank too much at the party. your friends are gone. your phone is dead. you don't remember anything.",
      icon: Skull,
      choices: [
        { text: "check your phone messages", next: 'check_messages', stats: { mental: -10 } },
        { text: "ask the nurse what happened", next: 'ask_nurse', stats: { mental: +5 } },
        { text: "sneak out before anyone notices", next: 'sneak_out_hospital', stats: { reputation: -15, mental: -20 } }
      ]
    },

    // CONTINUATION NODES FOR NEW STORIES
    deny_cheating: {
      text: "you swear you weren't cheating. the teacher doesn't believe you. calls your parents. they arrive. your dad's face is red with anger. 'not again,' he says.",
      icon: Skull,
      choices: [
        { text: "stick to your story", next: 'double_down_lie', stats: { mental: -25, reputation: -25, relationships: -30 } },
        { text: "break down and confess", next: 'late_confession', stats: { mental: -15, reputation: -10 } },
        { text: "blame it on stress", next: 'blame_stress', stats: { mental: +5, reputation: -5 } }
      ]
    },

    beg_teacher: {
      text: "'please sir, it was a mistake. i'll never do it again. my parents will kill me.' the teacher pauses. the class is silent. 'one chance,' he says. 'but you're retaking this exam.'",
      icon: Heart,
      choices: [
        { text: "thank him profusely", next: 'grateful_student', stats: { mental: +20, reputation: +5 } },
        { text: "study hard for the retake", next: 'dedicated_study', stats: { mental: +15, reputation: +10 } },
        { text: "cheat again anyway", next: 'repeat_mistake', stats: { mental: -30, reputation: -40 } }
      ]
    },

    confront_sister: {
      text: "you knock on her door. 'i read your diary. i'm worried about you.' she freezes. tears stream down her face. 'you weren't supposed to see that.'",
      icon: Heart,
      choices: [
        { text: "hug her and listen", next: 'supportive_sibling', stats: { relationships: +30, mental: +20 } },
        { text: "tell her she needs help", next: 'seek_professional_help', stats: { relationships: +15, mental: +10 } },
        { text: "promise to keep it secret", next: 'keep_sister_secret', stats: { relationships: +25, mental: +5 } }
      ]
    },

    surprise_party: {
      text: "you gather all your friends. decorate the house. when they arrive, their face lights up. 'you guys...' they start crying. it's the best night of your lives.",
      icon: Heart,
      choices: [
        { text: "dance all night", next: 'party_all_night', stats: { relationships: +35, mental: +25, money: -10 } },
        { text: "share memories and stories", next: 'share_memories', stats: { relationships: +40, mental: +30 } },
        { text: "give them a group gift", next: 'group_gift', stats: { money: -20, relationships: +30, mental: +20 } }
      ]
    },

    check_messages: {
      text: "your phone charges slowly. messages flood in. 'where are you?' 'are you okay?' 'we're worried.' one from someone you don't remember: 'last night was amazing.' oh no.",
      icon: Smartphone,
      choices: [
        { text: "call your best friend", next: 'call_bestie_hospital', stats: { relationships: +10, mental: +5 } },
        { text: "text the mystery person", next: 'text_mystery', stats: { reputation: -10, mental: -15 } },
        { text: "delete the messages", next: 'delete_evidence', stats: { mental: -20, reputation: -5 } }
      ]
    },

    // MORE CONTINUATIONS
    grateful_student: {
      text: "you study harder than ever. the retake comes. you pass. the teacher nods approvingly. 'good job. don't waste this chance.' you feel... redeemed.",
      icon: Heart,
      choices: [
        { text: "thank him again", next: 'final_thanks', stats: { reputation: +15, mental: +25 } },
        { text: "focus on future success", next: 'future_focus', stats: { mental: +30, reputation: +20 } },
        { text: "help other students", next: 'mentor_others', stats: { relationships: +20, reputation: +25 } }
      ]
    },

    supportive_sibling: {
      text: "you hold her as she cries. 'i'm here for you. always.' she clings to you. 'i'm scared,' she whispers. you promise to help her through this. together.",
      icon: Heart,
      choices: [
        { text: "research mental health resources", next: 'research_help', stats: { mental: +25, relationships: +35 } },
        { text: "be there for therapy sessions", next: 'therapy_support', stats: { relationships: +40, mental: +20 } },
        { text: "share your own struggles", next: 'mutual_support', stats: { relationships: +45, mental: +30 } }
      ]
    },

    party_all_night: {
      text: "music blares. you dance until dawn. laugh until your sides hurt. create memories that will last forever. as the sun rises, you know this friendship transcends distance.",
      icon: Heart,
      choices: [
        { text: "exchange promises to visit", next: 'visit_promises', stats: { relationships: +50, mental: +35 } },
        { text: "start a group chat tradition", next: 'group_chat', stats: { relationships: +45, mental: +30 } },
        { text: "plan future reunions", next: 'future_reunions', stats: { relationships: +40, mental: +25, money: -15 } }
      ]
    },

    call_bestie_hospital: {
      text: "'hey, i'm in hospital. what happened last night?' they tell you everything. you blacked out. made out with someone. threw up everywhere. they're worried about you.",
      icon: Users,
      choices: [
        { text: "promise to get help", next: 'seek_alcohol_help', stats: { mental: +20, relationships: +15 } },
        { text: "laugh it off", next: 'laugh_off_incident', stats: { mental: -10, reputation: -10 } },
        { text: "reflect on your life choices", next: 'life_reflection', stats: { mental: +30, reputation: +5 } }
      ]
    },

    // ENDINGS FOR NEW STORIES
    future_focus: {
      text: "you graduate top of your class. get a scholarship abroad. your teacher attends your graduation. 'i'm proud of you,' he says. redemption complete.",
      icon: Heart,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    },

    mutual_support: {
      text: "you and your sister grow closer than ever. you both get therapy. heal together. become each other's strength. family isn't perfect, but it's yours.",
      icon: Heart,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    },

    visit_promises: {
      text: "years later, you keep your promises. visit each other often. the distance made your friendship stronger. some bonds are unbreakable.",
      icon: Heart,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    },

    life_reflection: {
      text: "that hospital stay changes everything. you cut back on drinking. focus on yourself. become the person you always wanted to be. growth hurts, but it's worth it.",
      icon: Heart,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    },

    // 7 MORE STORY NODES
    start11: {
      text: "your instagram gets hacked. the hacker posts embarrassing photos and messages your followers. everyone you know sees your private messages.",
      icon: Smartphone,
      choices: [
        { text: "report it immediately", next: 'report_hack', stats: { reputation: -10, mental: -15 } },
        { text: "delete the account", next: 'delete_account', stats: { reputation: -20, mental: -10 } },
        { text: "try to recover it yourself", next: 'recover_self', stats: { mental: -20 } }
      ]
    },

    start12: {
      text: "you find out your boyfriend/girlfriend has been cheating on you for months. you see the messages. photos. everything. they don't know you know.",
      icon: Heart,
      choices: [
        { text: "confront them publicly", next: 'public_confrontation', stats: { reputation: +10, relationships: -40, mental: -25 } },
        { text: "break up quietly", next: 'quiet_breakup', stats: { mental: +10, relationships: -20 } },
        { text: "pretend you don't know", next: 'fake_ignorance', stats: { mental: -30, relationships: -10 } }
      ]
    },

    start13: {
      text: "your parents discover you're gay/bi/trans. they found your search history. they're waiting in the living room. faces like stone.",
      icon: Users,
      choices: [
        { text: "come out to them", next: 'come_out', stats: { mental: +20, relationships: -30 } },
        { text: "deny everything", next: 'deny_identity', stats: { mental: -40, relationships: -20 } },
        { text: "pack your bags and leave", next: 'leave_home', stats: { mental: -25, relationships: -50, money: -20 } }
      ]
    },

    start14: {
      text: "you get accepted to university abroad. full scholarship. but it means leaving your family, friends, everything you've ever known. decision time.",
      icon: Skull,
      choices: [
        { text: "accept and leave", next: 'accept_scholarship', stats: { mental: +15, relationships: -25, money: +50 } },
        { text: "decline and stay", next: 'decline_offer', stats: { relationships: +20, mental: -10 } },
        { text: "ask family what to do", next: 'family_advice', stats: { relationships: +15 } }
      ]
    },

    start15: {
      text: "your best friend asks you to help them cheat on their exam. they're failing the subject. 'just this once,' they say. you know it's wrong.",
      icon: Skull,
      choices: [
        { text: "help them cheat", next: 'help_cheat', stats: { relationships: +20, reputation: -15, mental: -20 } },
        { text: "refuse and encourage studying", next: 'refuse_help', stats: { relationships: -10, reputation: +10, mental: +10 } },
        { text: "report them to teacher", next: 'report_friend', stats: { relationships: -40, reputation: +5, mental: -15 } }
      ]
    },

    start16: {
      text: "you wake up next to someone you don't remember. hotel room. clothes everywhere. you were at a club last night. this isn't you.",
      icon: Skull,
      choices: [
        { text: "leave before they wake up", next: 'sneak_away', stats: { reputation: -20, mental: -25 } },
        { text: "wake them and talk", next: 'morning_after_talk', stats: { mental: +5 } },
        { text: "pretend to remember", next: 'fake_memory', stats: { mental: -15, reputation: -10 } }
      ]
    },

    start17: {
      text: "your grandmother is dying. she's been your rock your whole life. the family is gathering. she wants to talk to you alone.",
      icon: Heart,
      choices: [
        { text: "tell her you love her", next: 'love_confession', stats: { mental: +25, relationships: +30 } },
        { text: "ask for life advice", next: 'seek_advice', stats: { mental: +20, relationships: +25 } },
        { text: "share your secrets", next: 'share_secrets', stats: { mental: +15, relationships: +35 } }
      ]
    },

    // CONTINUATIONS FOR NEW STORIES
    report_hack: {
      text: "instagram support responds quickly. they recover your account. but screenshots of the hacked content are everywhere. the damage is done.",
      icon: Smartphone,
      choices: [
        { text: "post an explanation", next: 'public_explanation', stats: { reputation: +5, mental: -10 } },
        { text: "ignore and move on", next: 'ignore_damage', stats: { mental: +10 } },
        { text: "take a break from social media", next: 'social_break', stats: { mental: +20, reputation: +15 } }
      ]
    },

    public_confrontation: {
      text: "you show up at their workplace. 'how could you?' everyone watches. they beg for forgiveness. you feel powerful but broken inside.",
      icon: Heart,
      choices: [
        { text: "forgive them", next: 'forgive_cheater', stats: { relationships: +10, mental: -20 } },
        { text: "end it forever", next: 'final_breakup', stats: { mental: +15, relationships: -30 } },
        { text: "make them choose", next: 'ultimatum', stats: { mental: -10 } }
      ]
    },

    come_out: {
      text: "'mom, dad... i'm [identity].' silence. then your mom cries. your dad walks out. but you feel free. finally free.",
      icon: Users,
      choices: [
        { text: "give them time", next: 'give_time', stats: { mental: +30, relationships: -10 } },
        { text: "seek support elsewhere", next: 'find_support', stats: { mental: +25, relationships: +20 } },
        { text: "stand your ground", next: 'stand_ground', stats: { mental: +35, relationships: -20 } }
      ]
    },

    accept_scholarship: {
      text: "you board the plane. new country. new life. you cry the whole flight. but when you land... excitement. possibility. future.",
      icon: Heart,
      choices: [
        { text: "embrace the adventure", next: 'embrace_change', stats: { mental: +40, reputation: +20 } },
        { text: "call home every day", next: 'stay_connected', stats: { relationships: +25, mental: +20 } },
        { text: "focus on studies", next: 'study_focus', stats: { mental: +30, reputation: +25 } }
      ]
    },

    help_cheat: {
      text: "you slip them the answers. they pass. 'you're the best,' they say. but you can't look at yourself in the mirror.",
      icon: Skull,
      choices: [
        { text: "confess to teacher", next: 'late_confession_cheat', stats: { mental: +15, reputation: -10 } },
        { text: "live with the guilt", next: 'carry_guilt', stats: { mental: -25 } },
        { text: "end the friendship", next: 'end_friendship', stats: { relationships: -35, mental: +10 } }
      ]
    },

    morning_after_talk: {
      text: "'last night was... intense,' they say. you talk. laugh. exchange numbers. maybe this could be something real.",
      icon: Heart,
      choices: [
        { text: "give it a chance", next: 'potential_relationship', stats: { relationships: +30, mental: +15 } },
        { text: "keep it casual", next: 'casual_arrangement', stats: { relationships: +15, mental: -5 } },
        { text: "never contact them", next: 'no_contact', stats: { mental: -10 } }
      ]
    },

    love_confession: {
      text: "she smiles weakly. 'i know, child. i've always known.' she holds your hand. 'live your life. be happy. that's all i want.'",
      icon: Heart,
      choices: [
        { text: "promise to visit often", next: 'visit_often', stats: { relationships: +40, mental: +30 } },
        { text: "share family stories", next: 'family_stories', stats: { relationships: +35, mental: +25 } },
        { text: "say goodbye", next: 'peaceful_goodbye', stats: { mental: +35, relationships: +45 } }
      ]
    },

    // ENDINGS FOR NEW STORIES
    social_break: {
      text: "no more scrolling. no more likes. you read books. exercise. meet people in real life. 6 months later, you're happier than ever.",
      icon: Heart,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    },

    final_breakup: {
      text: "you block them everywhere. delete photos. cry for weeks. but slowly, you heal. become stronger. find someone who deserves you.",
      icon: Heart,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    },

    embrace_change: {
      text: "new friends. new culture. new you. the distance hurts but growth is worth it. you become the person you were meant to be.",
      icon: Heart,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    },

    carry_guilt: {
      text: "the guilt eats at you. you avoid your friend. school feels tainted. you learn: integrity matters more than friendship sometimes.",
      icon: Skull,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    },

    potential_relationship: {
      text: "one night becomes dates. dates become love. they become your person. sometimes the worst nights lead to the best mornings.",
      icon: Heart,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    },

    peaceful_goodbye: {
      text: "she passes peacefully. surrounded by family. her last words: 'i love you all.' you carry her wisdom. her love. forever.",
      icon: Heart,
      choices: [
        { text: "start a new story", next: 'random', stats: {} }
      ]
    }
  };

  // Pick starting node based on storyIndex
  useEffect(() => {
    const startNodes = Object.keys(storyNodes).filter(key => key.startsWith('start'));
    const startNodeKey = startNodes[storyIndex % startNodes.length];
    setCurrentNode(storyNodes[startNodeKey]);
  }, [storyIndex]);

  // Typing effect
  useEffect(() => {
    if (!currentNode) return;
    
    setDisplayText('');
    setShowChoices(false);
    setIsTyping(true);
    
    let index = 0;
    const text = currentNode.text;
    const typingSpeed = 30;
    
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        setTimeout(() => setShowChoices(true), 500);
        clearInterval(interval);
      }
    }, typingSpeed);
    
    return () => clearInterval(interval);
  }, [currentNode]);

  const handleChoice = (choice) => {
    // Update stats
    if (choice.stats) {
      setStats(prev => {
        const newStats = { ...prev };
        Object.keys(choice.stats).forEach(key => {
          newStats[key] = Math.max(0, Math.min(100, newStats[key] + choice.stats[key]));
        });
        return newStats;
      });
    }

    // Navigate to next node or next story
    if (choice.next === 'random' || !storyNodes[choice.next]) {
      setStoryIndex(prev => prev + 1);
    } else {
      setCurrentNode(storyNodes[choice.next]);
    }
  };

  const getStatColor = (value) => {
    if (value >= 70) return 'from-green-500 to-emerald-600';
    if (value >= 40) return 'from-yellow-500 to-amber-600';
    return 'from-red-500 to-rose-600';
  };

  if (!currentNode) return null;

  const Icon = currentNode.icon;

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-600 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto p-6 min-h-screen flex flex-col">
        {/* Header */}
        <div className="mb-8 pt-6">
          <h1 className="text-4xl font-bold mb-2 glitch" data-text="CHOICES">
            CHOICES
          </h1>
          <p className="text-gray-400 text-sm">every choice has consequences. no saves. no regrets.</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">relationships</span>
              <span className="text-xs text-white">{stats.relationships}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getStatColor(stats.relationships)} transition-all duration-500`}
                style={{ width: `${stats.relationships}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">money</span>
              <span className="text-xs text-white">{stats.money}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getStatColor(stats.money)} transition-all duration-500`}
                style={{ width: `${stats.money}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">mental health</span>
              <span className="text-xs text-white">{stats.mental}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getStatColor(stats.mental)} transition-all duration-500`}
                style={{ width: `${stats.mental}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur rounded-lg p-3 border border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">reputation</span>
              <span className="text-xs text-white">{stats.reputation}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getStatColor(stats.reputation)} transition-all duration-500`}
                style={{ width: `${stats.reputation}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Story Card */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-800 shadow-2xl mb-6 flex-1">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center animate-pulse">
                <Icon className="w-8 h-8" />
              </div>
            </div>

            {/* Story Text */}
            <div className="mb-8">
              <p className="text-lg leading-relaxed text-black">
                {displayText}
                {isTyping && <span className="inline-block w-2 h-5 bg-white ml-1 animate-pulse"></span>}
              </p>
            </div>

            {/* Choices */}
            <div className={`space-y-3 transition-all duration-500 ${showChoices ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {showChoices && currentNode.choices.every(choice => choice.next === 'random') ? (
                <button
                  onClick={() => handleChoice({ next: 'random' })}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-black font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20"
                >
                  <span className="mr-2">→</span>
                  Continue to Next Story
                </button>
              ) : (
                showChoices && currentNode.choices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(choice)}
                    className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-white to-gray-100 hover:from-gray-200 hover:to-gray-300 border border-gray-300 hover:border-gray-400 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-gray-400/20"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="text-black mr-2">→</span>
                    <span className="text-black">{choice.text}</span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Footer hint */}
          <div className="text-center text-gray-600 text-xs">
            <p>no progress saved. every playthrough is unique.</p>
            <p className="mt-1">refresh to start over randomly.</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        .glitch {
          animation: glitch 1s infinite;
        }
      `}</style>
    </div>
  );
};


export default ChoicesGame;
          