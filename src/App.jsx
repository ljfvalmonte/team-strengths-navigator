import { useState, useEffect, useCallback } from 'react';
import { Users, Plus, X, MessageCircle, ChevronDown, ChevronUp, Search, UserPlus, Lightbulb, AlertTriangle, Target, CheckSquare, Square, Sparkles, ArrowRight, Save, FolderOpen, StickyNote, Trash2, Edit3, Check, Star, Clock } from 'lucide-react';

const STRENGTHS_DATA = {
  "Achiever": { domain: "Executing", desc: "Driven by constant need for achievement", comm: "Be direct about goals and outcomes. They appreciate efficiency and tangible progress.", negot: "Frame proposals in terms of accomplishments and measurable results." },
  "Activator": { domain: "Influencing", desc: "Makes things happen by turning thoughts into action", comm: "Get to the point quickly. They prefer action over lengthy discussion.", negot: "Present options that allow for immediate next steps." },
  "Adaptability": { domain: "Relationship Building", desc: "Prefers to go with the flow", comm: "Be flexible in your approach. They handle change well but may need structure.", negot: "Build in flexibility. They're comfortable with evolving terms." },
  "Analytical": { domain: "Strategic Thinking", desc: "Searches for reasons and causes", comm: "Provide data and evidence. They need proof before accepting claims.", negot: "Come prepared with facts, figures, and logical reasoning." },
  "Arranger": { domain: "Executing", desc: "Organizes while remaining flexible", comm: "Discuss the big picture and moving parts. They think in systems.", negot: "Show how pieces fit together." },
  "Belief": { domain: "Executing", desc: "Has core values that are unchanging", comm: "Connect to purpose and meaning. Understand their values first.", negot: "Align proposals with their core values." },
  "Command": { domain: "Influencing", desc: "Has presence and can take control", comm: "Be confident and direct. They respect those who hold their ground.", negot: "Stand firm while showing respect." },
  "Communication": { domain: "Influencing", desc: "Finds it easy to put thoughts into words", comm: "Engage in dialogue. They process through talking and storytelling.", negot: "Use narratives and examples to illustrate points." },
  "Competition": { domain: "Influencing", desc: "Measures progress against others' performance", comm: "Acknowledge their wins. They're motivated by comparison.", negot: "Frame outcomes in terms of competitive advantage." },
  "Connectedness": { domain: "Relationship Building", desc: "Believes all things happen for a reason", comm: "Discuss broader implications. They see the bigger picture.", negot: "Show how agreement benefits the larger ecosystem." },
  "Consistency": { domain: "Executing", desc: "Treats people the same regardless of status", comm: "Be fair and predictable. They value equal treatment.", negot: "Ensure terms are equitable." },
  "Context": { domain: "Strategic Thinking", desc: "Enjoys thinking about the past", comm: "Provide background and history.", negot: "Reference precedents and past successes." },
  "Deliberative": { domain: "Executing", desc: "Takes serious care in making decisions", comm: "Give them time to process. Don't rush.", negot: "Provide information in advance when possible." },
  "Developer": { domain: "Relationship Building", desc: "Recognizes and cultivates potential in others", comm: "Show growth opportunities.", negot: "Frame outcomes in terms of growth potential." },
  "Discipline": { domain: "Executing", desc: "Enjoys routine and structure", comm: "Be organized and predictable.", negot: "Offer structured timelines and clear processes." },
  "Empathy": { domain: "Relationship Building", desc: "Can sense other people's feelings", comm: "Be authentic about emotions.", negot: "Acknowledge feelings in the room." },
  "Focus": { domain: "Executing", desc: "Takes direction, follows through", comm: "Stay on topic. Connect to their goals.", negot: "Be clear about how this serves their priorities." },
  "Futuristic": { domain: "Strategic Thinking", desc: "Inspired by the future and what could be", comm: "Paint a vision. They're motivated by possibilities.", negot: "Describe future scenarios and potential." },
  "Harmony": { domain: "Relationship Building", desc: "Looks for consensus and agreement", comm: "Find common ground first. Avoid unnecessary conflict.", negot: "Seek win-win outcomes." },
  "Ideation": { domain: "Strategic Thinking", desc: "Fascinated by ideas and connections", comm: "Brainstorm together. They love new concepts.", negot: "Be open to creative solutions." },
  "Includer": { domain: "Relationship Building", desc: "Wants to include others and expand the group", comm: "Acknowledge all stakeholders.", negot: "Consider the impact on everyone involved." },
  "Individualization": { domain: "Relationship Building", desc: "Intrigued by unique qualities of each person", comm: "Personalize your approach.", negot: "Customize terms when possible." },
  "Input": { domain: "Strategic Thinking", desc: "Has a craving to know more", comm: "Share resources and information.", negot: "Provide comprehensive information." },
  "Intellection": { domain: "Strategic Thinking", desc: "Characterized by intellectual activity", comm: "Allow thinking time.", negot: "Engage in thoughtful dialogue." },
  "Learner": { domain: "Strategic Thinking", desc: "Has a great desire to learn and improve", comm: "Share insights and new information.", negot: "Highlight what they'll learn." },
  "Maximizer": { domain: "Influencing", desc: "Focuses on strengths to stimulate excellence", comm: "Focus on strengths, not weaknesses.", negot: "Propose excellent outcomes, not just adequate ones." },
  "Positivity": { domain: "Relationship Building", desc: "Has contagious enthusiasm", comm: "Match their energy.", negot: "Keep the tone constructive." },
  "Relator": { domain: "Relationship Building", desc: "Enjoys close relationships with others", comm: "Build genuine connection.", negot: "Invest in the relationship first." },
  "Responsibility": { domain: "Executing", desc: "Takes ownership of commitments", comm: "Be reliable. Follow through.", negot: "Make clear commitments and honor them." },
  "Restorative": { domain: "Executing", desc: "Adept at dealing with problems", comm: "Don't hide problems. They're energized by solving them.", negot: "Be honest about obstacles." },
  "Self-Assurance": { domain: "Influencing", desc: "Confident in ability to manage their own life", comm: "Trust their judgment.", negot: "Respect their autonomy." },
  "Significance": { domain: "Influencing", desc: "Wants to be important in the eyes of others", comm: "Acknowledge their contributions.", negot: "Show how the outcome elevates their impact." },
  "Strategic": { domain: "Strategic Thinking", desc: "Creates alternative ways to proceed", comm: "Discuss options and scenarios.", negot: "Present choices rather than ultimatums." },
  "Woo": { domain: "Influencing", desc: "Loves meeting new people", comm: "Engage socially.", negot: "Allow for relationship building." }
};

// Domain key used internally for guidance lookups
const DOMAIN_KEY = {
  "Executing": "Executing",
  "Influencing": "Influencing",
  "Relationship Building": "Relationship Building",
  "Strategic Thinking": "Strategic Thinking"
};

const SCENARIOS = [
  { id: 'feedback', name: 'Delivering Difficult Feedback', icon: '💬', desc: 'Constructive criticism or performance concerns', 
    guidance: { Executing: "Be specific about what needs to change and expected outcomes. Provide clear metrics.", Influencing: "Frame feedback as an opportunity for greater impact. Be direct but acknowledge contributions.", "Relationship Building": "Lead with care and connection. Emphasize investment in their growth.", "Strategic Thinking": "Provide context and reasoning. Explain the 'why' with supporting evidence." },
    talkingPoints: {
      Executing: { opener: "I want to discuss something specific that will help us hit our targets.", messages: ["Here's what I've observed: [specific behavior]. The impact has been [concrete outcome].", "To meet our goals, here's what needs to change by [date]: [specific action].", "Let's agree on measurable milestones so we can track progress together."], closer: "I'm confident we can turn this around. Let's check in on [date] to review progress." },
      Influencing: { opener: "I want to talk about how we can increase your impact on the team.", messages: ["Your strengths in [area] are valuable. There's an opportunity to amplify that.", "Right now, [behavior] is limiting your influence. Here's how it's being perceived.", "Making this shift positions you as [positive outcome]. It's about maximizing your presence."], closer: "You have what it takes to lead here. Let's make sure nothing gets in the way of that." },
      "Relationship Building": { opener: "I care about your success here, and I want to share something that's been on my mind.", messages: ["I've noticed [behavior], and I wanted to understand what's behind it.", "I'm bringing this up because I believe in your potential and want to support you.", "How can we work through this together? What do you need from me?"], closer: "I appreciate you hearing me out. I'm here for you as we work through this." },
      "Strategic Thinking": { opener: "I'd like to walk through some observations and get your perspective.", messages: ["Looking at the data, here's what I'm seeing: [evidence-based observation].", "The pattern suggests [analysis]. What's your read on this?", "I'd like to understand the factors at play before we discuss next steps."], closer: "Let's take time to think this through. Can we reconnect in a few days with ideas?" }
    }},
  { id: 'pitch', name: 'Pitching a New Idea', icon: '💡', desc: 'Proposing changes or new initiatives', 
    guidance: { Executing: "Focus on implementation details and realistic timelines.", Influencing: "Lead with the vision and competitive advantage.", "Relationship Building": "Emphasize who benefits and how it strengthens connections.", "Strategic Thinking": "Present data, options, and scenarios. Allow processing time." },
    talkingPoints: {
      Executing: { opener: "I have a proposal that can deliver [specific outcome] by [timeframe].", messages: ["Here's the implementation plan with key milestones and owners.", "The resources required are [X], with expected ROI of [Y].", "I've identified the risks and built in contingencies for each."], closer: "If we greenlight this today, we can begin execution by [date]. What questions do you have?" },
      Influencing: { opener: "I've identified an opportunity that could set us apart from the competition.", messages: ["Imagine if we were the first to [bold vision]. Here's how we get there.", "This positions us as leaders in [space]. The visibility alone is worth considering.", "Early wins would include [quick victories]. The momentum builds from there."], closer: "This is our chance to make a real mark. I'd love your support in championing this." },
      "Relationship Building": { opener: "I've been thinking about how we can better support our team and stakeholders.", messages: ["This idea came from listening to what [people] have been asking for.", "It would strengthen our relationships with [groups] and show we're responsive.", "I'd love your input on shaping this—your perspective would make it stronger."], closer: "Can I count on you to help refine this? Your involvement would mean a lot." },
      "Strategic Thinking": { opener: "I've analyzed an opportunity and want to walk you through my findings.", messages: ["The data shows [trend]. Here are three scenarios for how we could respond.", "Option A offers [benefits/risks], Option B provides [benefits/risks], Option C...", "I've attached the full analysis. I'd value your thoughts after you've reviewed it."], closer: "Take whatever time you need to process this. I'm happy to discuss when you're ready." }
    }},
  { id: 'conflict', name: 'Resolving a Conflict', icon: '⚖️', desc: 'Addressing disagreements or tensions', 
    guidance: { Executing: "Focus on solving the problem. Propose concrete steps.", Influencing: "Be direct about the issue while respecting their perspective.", "Relationship Building": "Acknowledge emotions first. Seek understanding before agreement.", "Strategic Thinking": "Analyze the root cause together. Use facts to depersonalize." },
    talkingPoints: {
      Executing: { opener: "We have a situation that's affecting our ability to deliver. Let's solve it.", messages: ["Here's the issue as I see it: [factual description of problem].", "Regardless of how we got here, we need a path forward. Here's my proposal.", "Can we agree on these specific actions and check back in [timeframe]?"], closer: "Let's focus on the solution. I'm committed to making this work if you are." },
      Influencing: { opener: "I want to address something directly because I respect you enough to be honest.", messages: ["From my perspective, here's what's happening: [direct statement].", "I hear your position. Here's where I think we can find common ground.", "We're both leaders here. Let's model how to work through disagreement."], closer: "I appreciate you engaging on this. Let's shake on a path forward." },
      "Relationship Building": { opener: "I sense there's tension between us, and I'd like to clear the air.", messages: ["Before we problem-solve, I want to understand how you're feeling about this.", "I realize my actions may have contributed to this. I'm sorry for [specific impact].", "What do you need from me to rebuild trust? I'm genuinely asking."], closer: "Thank you for being open with me. Our relationship matters, and I'm committed to this." },
      "Strategic Thinking": { opener: "I'd like to step back and analyze what's really driving this disagreement.", messages: ["If we look at the facts objectively, here's what we can agree on...", "The disconnect seems to be in [area]. Let's examine our assumptions there.", "What information would help us get aligned? Let's find it together."], closer: "I think we've made progress in understanding. Let's both reflect and reconvene." }
    }},
  { id: 'delegate', name: 'Delegating Tasks', icon: '📋', desc: 'Assigning work and responsibilities', 
    guidance: { Executing: "Be clear about expectations, deadlines, and quality standards.", Influencing: "Explain why they're the right person. Connect to visibility.", "Relationship Building": "Show trust and express confidence. Offer support.", "Strategic Thinking": "Provide context on how this fits the bigger picture." },
    talkingPoints: {
      Executing: { opener: "I have an important task that needs your execution skills.", messages: ["Here's the deliverable: [specific outcome] by [date].", "Success looks like [clear criteria]. Here are the quality standards.", "You'll have authority over [decisions]. Escalate to me if [conditions]."], closer: "I trust you to deliver. Let's set a check-in for [date] to review progress." },
      Influencing: { opener: "I have an opportunity that I think you're uniquely positioned to own.", messages: ["This project has high visibility with [stakeholders]. It's a chance to shine.", "I'm giving this to you because you have the presence to drive it forward.", "Make it your own. I want to see your leadership stamp on this."], closer: "Run with it. I'll be here if you need air cover, but this is your show." },
      "Relationship Building": { opener: "I'd like to entrust you with something important because I believe in you.", messages: ["This matters to me, and I'm choosing you because I trust your judgment.", "I'll be here to support you—don't hesitate to reach out if you need anything.", "How are you feeling about taking this on? What would help you succeed?"], closer: "I'm grateful you're willing to take this on. Let's stay connected throughout." },
      "Strategic Thinking": { opener: "I want to give you context on a task and explain why it matters.", messages: ["Here's how this fits into our larger strategy: [big picture context].", "The background you need: [relevant history and information].", "I'm open to your thoughts on approach once you've had time to consider it."], closer: "Take time to think through your approach. Let's discuss your plan when you're ready." }
    }},
  { id: 'resources', name: 'Requesting Resources', icon: '🎯', desc: 'Asking for budget, time, or support', 
    guidance: { Executing: "Present a clear plan showing ROI and efficient use.", Influencing: "Frame in terms of competitive positioning and bold outcomes.", "Relationship Building": "Connect to team wellbeing and relationship impact.", "Strategic Thinking": "Provide data-driven justification with multiple options." },
    talkingPoints: {
      Executing: { opener: "I have a resource request with a clear business case and ROI.", messages: ["I need [specific resources] to deliver [specific outcome] by [date].", "Here's the cost-benefit analysis: investment of [X] yields [Y] return.", "I've identified the most efficient path. Here's my implementation plan."], closer: "With your approval today, we can begin delivering value by [date]." },
      Influencing: { opener: "I see an opportunity to gain significant competitive advantage with the right investment.", messages: ["Our competitors are [doing X]. This investment lets us leapfrog them.", "The upside is [bold outcome]. This could define our position in the market.", "I'm willing to stake my reputation on this delivering results."], closer: "This is the kind of bold move that gets noticed. I hope you'll back me on it." },
      "Relationship Building": { opener: "I want to discuss resources that would meaningfully support our team.", messages: ["Our people are stretched thin, and it's affecting morale and wellbeing.", "This investment shows we value our team and strengthens our culture.", "I've heard directly from [people] how much this would mean to them."], closer: "Supporting our people is supporting our mission. I hope we can make this happen." },
      "Strategic Thinking": { opener: "I've prepared an analysis of resource options with different scenarios.", messages: ["Here are three investment levels with projected outcomes for each.", "The data supporting this request includes [evidence and research].", "I've considered alternatives—here's why this approach is optimal."], closer: "I'll leave this with you to review. Happy to discuss any questions that arise." }
    }},
  { id: 'deadline', name: 'Negotiating Deadlines', icon: '⏰', desc: 'Adjusting timelines', 
    guidance: { Executing: "Be honest about constraints. Propose realistic alternatives.", Influencing: "Frame extension as serving a better outcome.", "Relationship Building": "Acknowledge impact on others. Offer to help mitigate.", "Strategic Thinking": "Explain factors that changed. Provide options with trade-offs." },
    talkingPoints: {
      Executing: { opener: "I need to discuss the timeline—I want to be upfront about where we stand.", messages: ["Here's our current status: [factual progress update].", "To deliver quality work, I'm proposing [new date]. Here's the revised plan.", "I can commit to [interim deliverable] by the original date if that helps."], closer: "I take deadlines seriously. This adjustment ensures we deliver right, not just fast." },
      Influencing: { opener: "I want to discuss the timeline to ensure we deliver something we're proud of.", messages: ["Rushing this risks [negative outcome]. A strong result is worth the wait.", "With [additional time], I can deliver something that really makes an impact.", "I'd rather have this conversation now than deliver something mediocre."], closer: "Trust me to make the most of this time. The end result will speak for itself." },
      "Relationship Building": { opener: "I know this timeline affects others, and I want to discuss it openly.", messages: ["I'm sorry for the impact this may have on your plans. I don't ask this lightly.", "Here's what happened: [honest explanation]. I should have flagged it sooner.", "How can I help mitigate the downstream effects? I want to make this easier."], closer: "I appreciate your understanding. I won't forget this flexibility." },
      "Strategic Thinking": { opener: "I'd like to walk through the factors affecting our timeline and discuss options.", messages: ["Several variables have changed since we set the deadline: [factors].", "Here are three options with different time/quality/scope trade-offs.", "Given the new information, which trade-off makes most sense strategically?"], closer: "Let me know which direction you prefer. I'll build a revised plan accordingly." }
    }},
  { id: 'buyin', name: 'Getting Buy-In', icon: '🤝', desc: 'Building consensus for decisions', 
    guidance: { Executing: "Show the path to results. Demonstrate thorough planning.", Influencing: "Create a compelling narrative. Show early wins potential.", "Relationship Building": "Involve them early and incorporate their input.", "Strategic Thinking": "Present the analysis. Provide time to process." },
    talkingPoints: {
      Executing: { opener: "I've developed a plan and want to walk you through the execution path.", messages: ["Here's exactly how this will work, step by step.", "I've pressure-tested this plan. Here's how we handle the likely obstacles.", "The milestones are clear, and accountability is built in at every stage."], closer: "I've done the homework. With your support, we can start executing immediately." },
      Influencing: { opener: "I have a vision I'm excited about, and I want you to be part of it.", messages: ["Picture this: [compelling future state]. That's what we're building toward.", "You'd be instrumental in making this happen. Your influence is key.", "Early momentum will come from [quick wins]. People will want to join us."], closer: "I want you on this journey. Your support would make all the difference." },
      "Relationship Building": { opener: "I value your perspective and want to shape this idea together.", messages: ["Before I finalize anything, I wanted your honest input.", "What concerns do you have? I want to address them genuinely.", "How can we adjust this so it works for everyone involved?"], closer: "Your fingerprints are on this now. I hope you feel ownership in what we build." },
      "Strategic Thinking": { opener: "I've analyzed this thoroughly and want to share my findings for your consideration.", messages: ["Here's the research that led me to this conclusion: [evidence].", "I've considered the counterarguments. Here's how I'd address each.", "I welcome scrutiny—poke holes in this so we can make it stronger."], closer: "Take time to review. I'm confident the logic holds up, but I value your analysis." }
    }},
  { id: 'change', name: 'Announcing Change', icon: '🔄', desc: 'Communicating organizational changes', 
    guidance: { Executing: "Be clear about what's changing, when, and what's expected.", Influencing: "Frame change as opportunity. Be confident in direction.", "Relationship Building": "Acknowledge emotional impact. Be available for support.", "Strategic Thinking": "Explain reasoning and data behind the decision." },
    talkingPoints: {
      Executing: { opener: "I want to clearly communicate some changes and what they mean for you.", messages: ["Effective [date], here's what's changing: [specific changes].", "Here's what stays the same: [continuity points].", "Your new responsibilities/process/reporting will be: [clear expectations]."], closer: "I'll send a written summary. Let's meet again in [timeframe] to address questions." },
      Influencing: { opener: "We're making a bold move, and I want to share why I'm excited about it.", messages: ["This change positions us to [opportunity]. It's the right move.", "Yes, it's different—but different is how we get ahead.", "I need champions for this change. I'm counting on you to lead the way."], closer: "Change is hard, but staying still is harder. Let's own this transition together." },
      "Relationship Building": { opener: "I have some news to share, and I want to be thoughtful about how you receive it.", messages: ["I know change can be unsettling. Your feelings about this are valid.", "Here's what's happening and why: [honest explanation].", "I'm here for you. What questions or concerns can I address right now?"], closer: "My door is open. Please come to me anytime as you process this." },
      "Strategic Thinking": { opener: "I want to explain the thinking behind some changes we're implementing.", messages: ["The data and trends that led to this decision include: [evidence].", "We considered alternatives. Here's why this path made the most sense.", "The expected outcomes are [projections]. We'll measure success by [metrics]."], closer: "I'm happy to share more details. Take time to digest this and follow up with questions." }
    }},
  { id: 'custom', name: 'Custom Scenario', icon: '✏️', desc: 'Describe your own situation', guidance: null, talkingPoints: null }
];

const DOMAIN_COLORS = {
  "Executing": { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  "Influencing": { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  "Relationship Building": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
  "Strategic Thinking": { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" }
};

const ALL_STRENGTHS = Object.keys(STRENGTHS_DATA).sort();

// ─── Storage helpers (localStorage, works on GitHub Pages) ───
const storage = {
  get(key) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch { return null; }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage write failed:', e);
    }
  },
  remove(key) {
    try { localStorage.removeItem(key); } catch {}
  }
};

const STORAGE_KEYS = {
  COLLEAGUES: 'tsn-colleagues',
  PROFILES: 'tsn-profiles',
  NOTES: 'tsn-notes',
};

export default function App() {
  const [colleagues, setColleagues] = useState(() => storage.get(STORAGE_KEYS.COLLEAGUES) || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStrengths, setNewStrengths] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColleagues, setSelectedColleagues] = useState([]);
  const [activeTab, setActiveTab] = useState('profiles');
  const [expandedCards, setExpandedCards] = useState({});
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [customScenario, setCustomScenario] = useState('');
  const [showGuidance, setShowGuidance] = useState(false);
  
  const [savedProfiles, setSavedProfiles] = useState(() => storage.get(STORAGE_KEYS.PROFILES) || []);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [profileName, setProfileName] = useState('');
  
  const [notes, setNotes] = useState(() => storage.get(STORAGE_KEYS.NOTES) || []);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [noteContext, setNoteContext] = useState({ type: 'general', colleagueIds: [], scenario: '' });

  // ─── Auto-save whenever data changes ───
  useEffect(() => { storage.set(STORAGE_KEYS.COLLEAGUES, colleagues); }, [colleagues]);
  useEffect(() => { storage.set(STORAGE_KEYS.PROFILES, savedProfiles); }, [savedProfiles]);
  useEffect(() => { storage.set(STORAGE_KEYS.NOTES, notes); }, [notes]);

  // ─── Profile save/load ───
  const saveCurrentProfile = () => {
    if (!profileName.trim() || colleagues.length === 0) return;
    const newProfile = {
      id: Date.now(),
      name: profileName.trim(),
      colleagues: colleagues,
      createdAt: new Date().toISOString()
    };
    setSavedProfiles(prev => [...prev, newProfile]);
    setProfileName('');
    setShowSaveModal(false);
  };

  const loadProfile = (profile) => {
    setColleagues(profile.colleagues);
    setSelectedColleagues([]);
    setShowLoadModal(false);
  };

  const deleteProfile = (id) => {
    setSavedProfiles(prev => prev.filter(p => p.id !== id));
  };

  // ─── Notes ───
  const saveNote = () => {
    if (!noteText.trim()) return;
    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === editingNote.id ? { ...n, text: noteText, context: noteContext, updatedAt: new Date().toISOString() } : n));
    } else {
      const newNote = { id: Date.now(), text: noteText, context: noteContext, createdAt: new Date().toISOString() };
      setNotes(prev => [...prev, newNote]);
    }
    resetNoteForm();
  };

  const deleteNote = (id) => { setNotes(prev => prev.filter(n => n.id !== id)); };

  const editNote = (note) => {
    setEditingNote(note);
    setNoteText(note.text);
    setNoteContext(note.context);
    setShowNotesModal(true);
  };

  const resetNoteForm = () => {
    setNoteText('');
    setNoteContext({ type: 'general', colleagueIds: [], scenario: '' });
    setEditingNote(null);
    setShowNotesModal(false);
  };

  const openNewNote = () => {
    setNoteContext({ type: selectedColleagues.length > 0 ? 'person' : 'general', colleagueIds: [...selectedColleagues], scenario: selectedScenario || '' });
    setShowNotesModal(true);
  };

  const getRelevantNotes = () => {
    return notes.filter(n => {
      if (n.context.type === 'general') return true;
      if (n.context.colleagueIds?.length > 0) {
        return n.context.colleagueIds.some(id => selectedColleagues.includes(id) || colleagues.some(c => c.id === id));
      }
      return true;
    });
  };

  const getColleagueNames = (ids) => {
    return ids.map(id => colleagues.find(c => c.id === id)?.name || 'Unknown').filter(Boolean).join(', ');
  };

  // ─── Core functions ───
  const addColleague = () => {
    if (newName.trim() && newStrengths.length > 0 && colleagues.length < 10) {
      setColleagues(prev => [...prev, { id: Date.now(), name: newName.trim(), strengths: newStrengths }]);
      setNewName('');
      setNewStrengths([]);
      setShowAddForm(false);
    }
  };

  const removeColleague = (id) => {
    setColleagues(prev => prev.filter(c => c.id !== id));
    setSelectedColleagues(prev => prev.filter(cid => cid !== id));
  };

  const toggleColleagueSelection = (id) => {
    setSelectedColleagues(prev => prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]);
    setShowGuidance(false);
  };

  const selectAll = () => { setSelectedColleagues(colleagues.map(c => c.id)); setShowGuidance(false); };
  const clearSelection = () => { setSelectedColleagues([]); setShowGuidance(false); };

  const toggleStrength = (strength) => {
    if (newStrengths.includes(strength)) {
      setNewStrengths(newStrengths.filter(s => s !== strength));
    } else if (newStrengths.length < 10) {
      setNewStrengths([...newStrengths, strength]);
    }
  };

  const filteredStrengths = ALL_STRENGTHS.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
  const getSelectedColleaguesData = () => colleagues.filter(c => selectedColleagues.includes(c.id));

  const getGroupDomainDistribution = () => {
    const selected = getSelectedColleaguesData();
    const dist = { "Executing": 0, "Influencing": 0, "Relationship Building": 0, "Strategic Thinking": 0 };
    selected.forEach(c => c.strengths.forEach(s => { if (STRENGTHS_DATA[s]) dist[STRENGTHS_DATA[s].domain]++; }));
    return dist;
  };

  const getDominantDomains = () => {
    const dist = getGroupDomainDistribution();
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    if (total === 0) return [];
    return Object.entries(dist).sort((a, b) => b[1] - a[1]).filter(([_, count]) => count / total >= 0.25).map(([domain]) => domain);
  };

  const getTeamDomainDistribution = () => {
    const dist = { "Executing": 0, "Influencing": 0, "Relationship Building": 0, "Strategic Thinking": 0 };
    colleagues.forEach(c => c.strengths.forEach(s => { if (STRENGTHS_DATA[s]) dist[STRENGTHS_DATA[s].domain]++; }));
    return dist;
  };

  // Helper to resolve domain key for scenario lookups
  // Scenarios use domain keys that may be short ("Relationship Building") or legacy short ("Relationship")
  const getScenarioDomainKey = (scenario, domain) => {
    if (scenario?.guidance?.[domain]) return domain;
    // Fallback for any legacy data
    const shortMap = { "Relationship Building": "Relationship", "Strategic Thinking": "Strategic" };
    if (shortMap[domain] && scenario?.guidance?.[shortMap[domain]]) return shortMap[domain];
    return domain;
  };

  const generateGuidance = () => {
    if (!selectedScenario || selectedColleagues.length === 0) return null;
    const selected = getSelectedColleaguesData();
    const dominantDomains = getDominantDomains();
    const scenario = SCENARIOS.find(s => s.id === selectedScenario);
    const isCustom = selectedScenario === 'custom';
    const scenarioLabel = isCustom ? (customScenario.trim() || 'your situation') : scenario.name;
    
    const guidance = { overview: '', domainStrategies: [], individualTips: [], doList: [], avoidList: [], talkingPoints: [] };
    guidance.overview = selected.length === 1 
      ? `When communicating with ${selected[0].name} about "${scenarioLabel}", tailor your approach to their strengths.`
      : `When addressing ${selected.length} people about "${scenarioLabel}", balance your approach across their diverse strengths.`;

    const genericDomainGuidance = {
      "Executing": "Focus on clear outcomes, specific action items, and realistic timelines. They value efficiency and follow-through.",
      "Influencing": "Be confident and direct. Acknowledge their impact and give them opportunity to shape the direction.",
      "Relationship Building": "Lead with genuine care and connection. Acknowledge emotions and involve them in the process.",
      "Strategic Thinking": "Provide context, data, and reasoning. Allow time for them to process and ask questions."
    };

    const genericTalkingPoints = {
      "Executing": { opener: "I want to discuss something specific and actionable.", messages: ["Here's exactly what I'm proposing and the expected outcome.", "The timeline and milestones would be as follows...", "Here's how we'll measure success."], closer: "Let's agree on next steps and a check-in date." },
      "Influencing": { opener: "I have something important I'd like your perspective on.", messages: ["Here's the opportunity as I see it and why it matters.", "Your influence would be valuable in making this happen.", "This could really elevate our position."], closer: "I'd value your support on this. What do you think?" },
      "Relationship Building": { opener: "I wanted to have a genuine conversation with you about something.", messages: ["I'm bringing this to you because I value our relationship.", "I'd love to hear your thoughts and feelings on this.", "How can we approach this together?"], closer: "Thank you for taking the time. Your perspective means a lot." },
      "Strategic Thinking": { opener: "I'd like to walk you through my thinking on something.", messages: ["Here's the analysis and the factors I've considered.", "I see a few different options, each with trade-offs.", "What's your read on this? I'd value your input."], closer: "Take time to think it over. I'm happy to discuss further." }
    };

    dominantDomains.forEach(domain => {
      const strategy = scenario?.guidance?.[domain] || genericDomainGuidance[domain];
      guidance.domainStrategies.push({ domain, strategy });
      
      const tp = scenario?.talkingPoints?.[domain] || genericTalkingPoints[domain];
      guidance.talkingPoints.push({ domain, ...tp });
    });

    selected.forEach(person => {
      const tips = person.strengths.slice(0, 3).map(s => ({
        strength: s,
        tip: STRENGTHS_DATA[s]?.comm || ''
      })).filter(t => t.tip);
      guidance.individualTips.push({ person: person.name, tips });
    });

    const doAvoid = {
      "Executing": { do: ["Be specific about outcomes", "Provide clear action items", "Follow through on commitments"], avoid: ["Being vague", "Changing plans without explanation", "Wasting time"] },
      "Influencing": { do: ["Be confident and direct", "Acknowledge their impact", "Allow them to shape direction"], avoid: ["Being passive", "Undermining authority", "Excessive deliberation"] },
      "Relationship Building": { do: ["Lead with genuine care", "Acknowledge emotions", "Involve them in the process"], avoid: ["Being transactional", "Ignoring human impact", "Rushing"] },
      "Strategic Thinking": { do: ["Provide data and context", "Allow processing time", "Explain reasoning"], avoid: ["Unsupported claims", "Pressuring for decisions", "Oversimplifying"] }
    };
    dominantDomains.forEach(domain => {
      if (doAvoid[domain]) {
        guidance.doList.push(...doAvoid[domain].do);
        guidance.avoidList.push(...doAvoid[domain].avoid);
      }
    });
    guidance.doList = [...new Set(guidance.doList)].slice(0, 5);
    guidance.avoidList = [...new Set(guidance.avoidList)].slice(0, 5);
    return guidance;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-4">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            Team Strengths Navigator
          </h1>
          <p className="text-slate-600 text-sm mt-1">Improve communication using CliftonStrengths</p>
          <p className="text-slate-400 text-xs mt-0.5">Your data is saved automatically in this browser</p>
        </header>

        {/* Action Bar */}
        <div className="flex justify-center gap-2 mb-4">
          <button onClick={() => setShowSaveModal(true)} disabled={colleagues.length === 0} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50">
            <Save className="w-4 h-4" /> Save As Profile
          </button>
          <button onClick={() => setShowLoadModal(true)} disabled={savedProfiles.length === 0} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50">
            <FolderOpen className="w-4 h-4" /> Load ({savedProfiles.length})
          </button>
          <button onClick={openNewNote} className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 border border-amber-300 text-amber-800 rounded-lg text-sm hover:bg-amber-200">
            <StickyNote className="w-4 h-4" /> Add Note
          </button>
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-700">Team Members ({colleagues.length}/10)</h2>
            <div className="flex gap-2">
              {colleagues.length > 0 && (
                <>
                  <button onClick={selectAll} className="text-xs px-2 py-1 text-indigo-600 hover:bg-indigo-50 rounded">Select All</button>
                  <button onClick={clearSelection} className="text-xs px-2 py-1 text-slate-500 hover:bg-slate-100 rounded">Clear</button>
                </>
              )}
              {colleagues.length < 10 && (
                <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
                  <UserPlus className="w-4 h-4" /> Add
                </button>
              )}
            </div>
          </div>
          
          {colleagues.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">Add team members or load a saved profile to get started.</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-2">
                {colleagues.map(c => (
                  <div key={c.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition border-2 ${selectedColleagues.includes(c.id) ? 'bg-indigo-100 border-indigo-400' : 'bg-slate-100 border-transparent hover:bg-slate-200'}`}>
                    <button onClick={() => toggleColleagueSelection(c.id)} className="flex items-center gap-2">
                      {selectedColleagues.includes(c.id) ? <CheckSquare className="w-4 h-4 text-indigo-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                      <span className="text-sm font-medium">{c.name}</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); removeColleague(c.id); }} className="text-slate-400 hover:text-red-500" aria-label={`Remove ${c.name}`}>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              {selectedColleagues.length > 0 && <p className="text-xs text-indigo-600 font-medium">{selectedColleagues.length} selected</p>}
            </>
          )}
        </div>

        {/* Notes Preview */}
        {notes.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-amber-800 text-sm flex items-center gap-1"><StickyNote className="w-4 h-4" /> Notes ({notes.length})</h3>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {getRelevantNotes().slice(0, 3).map(note => (
                <div key={note.id} className="bg-white rounded-lg p-2 text-sm border border-amber-200">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 truncate">{note.text}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        {note.context.colleagueIds?.length > 0 && (
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{getColleagueNames(note.context.colleagueIds)}</span>
                        )}
                        {note.context.scenario && <span className="px-1.5 py-0.5 bg-slate-100 rounded">{SCENARIOS.find(s => s.id === note.context.scenario)?.name || note.context.scenario}</span>}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => editNote(note)} className="p-1 text-slate-400 hover:text-indigo-600" aria-label="Edit note"><Edit3 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteNote(note.id)} className="p-1 text-slate-400 hover:text-red-500" aria-label="Delete note"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {notes.length > 3 && <p className="text-xs text-amber-700 text-center">+{notes.length - 3} more notes</p>}
            </div>
          </div>
        )}

        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => { setShowSaveModal(false); setProfileName(''); }}>
            <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-4" onClick={e => e.stopPropagation()}>
              <h3 className="font-semibold text-lg mb-1">Save Team Profile</h3>
              <p className="text-xs text-slate-500 mb-3">Your current team is already auto-saved. Use this to create a named snapshot you can switch between.</p>
              <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveCurrentProfile()} placeholder="Profile name..." className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-3" autoFocus />
              <div className="flex justify-end gap-2">
                <button onClick={() => { setShowSaveModal(false); setProfileName(''); }} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={saveCurrentProfile} disabled={!profileName.trim()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">Save</button>
              </div>
            </div>
          </div>
        )}

        {/* Load Modal */}
        {showLoadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowLoadModal(false)}>
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4 max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">Saved Profiles</h3>
                <button onClick={() => setShowLoadModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              {savedProfiles.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No saved profiles yet.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {savedProfiles.map(profile => (
                    <div key={profile.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{profile.name}</p>
                        <p className="text-xs text-slate-500">{profile.colleagues.length} members • {new Date(profile.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => loadProfile(profile)} className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">Load</button>
                        <button onClick={() => deleteProfile(profile.id)} className="p-1 text-slate-400 hover:text-red-500" aria-label="Delete profile"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes Modal */}
        {showNotesModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={resetNoteForm}>
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-4" onClick={e => e.stopPropagation()}>
              <h3 className="font-semibold text-lg mb-3">{editingNote ? 'Edit Note' : 'Add Note'}</h3>
              <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Your note..." className="w-full px-3 py-2 border border-slate-300 rounded-lg h-24 resize-none mb-3" autoFocus />
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Link to people (optional)</label>
                <div className="flex flex-wrap gap-1">
                  {colleagues.map(c => (
                    <button key={c.id} onClick={() => setNoteContext({...noteContext, colleagueIds: noteContext.colleagueIds.includes(c.id) ? noteContext.colleagueIds.filter(id => id !== c.id) : [...noteContext.colleagueIds, c.id]})} className={`px-2 py-1 rounded text-xs ${noteContext.colleagueIds.includes(c.id) ? 'bg-indigo-100 text-indigo-700 border border-indigo-300' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Link to scenario (optional)</label>
                <select value={noteContext.scenario} onChange={(e) => setNoteContext({...noteContext, scenario: e.target.value})} className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option value="">None</option>
                  {SCENARIOS.filter(s => s.id !== 'custom').map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                </select>
              </div>
              
              <div className="flex justify-end gap-2">
                <button onClick={resetNoteForm} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={saveNote} disabled={!noteText.trim()} className="px-4 py-2 bg-amber-500 text-white rounded-lg disabled:opacity-50">{editingNote ? 'Update' : 'Save'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Add Member Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-semibold text-lg">Add Team Member</h3>
                <button onClick={() => { setShowAddForm(false); setNewName(''); setNewStrengths([]); setSearchTerm(''); }} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Colleague's name" className="w-full px-3 py-2 border border-slate-300 rounded-lg" autoFocus />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Strengths ({newStrengths.length} selected — enter Top 5 or up to 10)</label>
                  <div className="relative mb-2">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search strengths..." className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm" />
                  </div>
                  {newStrengths.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {newStrengths.map((s, i) => (
                        <span key={s} className={`px-2 py-0.5 rounded text-xs font-medium ${DOMAIN_COLORS[STRENGTHS_DATA[s].domain].bg} ${DOMAIN_COLORS[STRENGTHS_DATA[s].domain].text}`}>
                          {i + 1}. {s} <button onClick={() => toggleStrength(s)} aria-label={`Remove ${s}`}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="h-40 overflow-y-auto border border-slate-200 rounded-lg">
                    {filteredStrengths.map(s => {
                      const data = STRENGTHS_DATA[s];
                      const isSelected = newStrengths.includes(s);
                      return (
                        <button key={s} onClick={() => toggleStrength(s)} disabled={!isSelected && newStrengths.length >= 10} className={`w-full text-left px-3 py-2 border-b border-slate-100 last:border-0 ${isSelected ? 'bg-indigo-50' : 'hover:bg-slate-50'} ${!isSelected && newStrengths.length >= 10 ? 'opacity-50' : ''}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{s}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${DOMAIN_COLORS[data.domain].bg} ${DOMAIN_COLORS[data.domain].text}`}>{data.domain}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-slate-200 flex justify-end gap-2">
                <button onClick={() => { setShowAddForm(false); setNewName(''); setNewStrengths([]); }} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button onClick={addColleague} disabled={!newName.trim() || newStrengths.length === 0} className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">Add</button>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        {colleagues.length > 0 && (
          <div className="flex gap-1 mb-4 bg-white rounded-lg p-1 shadow-sm border border-slate-200">
            {[
              { id: 'profiles', label: 'Profiles', icon: Users },
              { id: 'scenarios', label: 'Scenarios', icon: Sparkles },
              { id: 'communicate', label: 'Quick Tips', icon: MessageCircle },
              { id: 'dynamics', label: 'Dynamics', icon: Target }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Profiles Tab */}
        {colleagues.length > 0 && activeTab === 'profiles' && (
          <div className="space-y-3">
            {colleagues.map(c => (
              <div key={c.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${selectedColleagues.includes(c.id) ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200'}`}>
                <button onClick={() => setExpandedCards({...expandedCards, [c.id]: !expandedCards[c.id]})} className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">{c.name[0]}</div>
                    <div className="text-left">
                      <h3 className="font-semibold">{c.name}</h3>
                      <p className="text-xs text-slate-500">{c.strengths.slice(0, 3).join(' • ')}{c.strengths.length > 3 ? ` +${c.strengths.length - 3} more` : ''}</p>
                    </div>
                  </div>
                  {expandedCards[c.id] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {expandedCards[c.id] && (
                  <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                    <div className="grid grid-cols-2 gap-2">
                      {c.strengths.map((s, i) => (
                        <div key={s} className={`p-2 rounded-lg ${DOMAIN_COLORS[STRENGTHS_DATA[s]?.domain]?.bg || 'bg-slate-100'} ${DOMAIN_COLORS[STRENGTHS_DATA[s]?.domain]?.border || 'border-slate-200'} border`}>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">#{i + 1}</span>
                            <span className={`font-medium text-sm ${DOMAIN_COLORS[STRENGTHS_DATA[s]?.domain]?.text || 'text-slate-700'}`}>{s}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{STRENGTHS_DATA[s]?.desc}</p>
                        </div>
                      ))}
                    </div>
                    {notes.filter(n => n.context.colleagueIds?.includes(c.id)).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-xs font-medium text-slate-500 mb-2">Notes about {c.name}</p>
                        {notes.filter(n => n.context.colleagueIds?.includes(c.id)).map(note => (
                          <div key={note.id} className="bg-amber-50 p-2 rounded text-xs text-amber-900 mb-1">{note.text}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Scenarios Tab */}
        {colleagues.length > 0 && activeTab === 'scenarios' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Choose a Scenario
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SCENARIOS.map(scenario => (
                  <button key={scenario.id} onClick={() => { setSelectedScenario(scenario.id); setShowGuidance(false); }} className={`p-3 rounded-lg border text-left transition ${selectedScenario === scenario.id ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{scenario.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{scenario.name}</p>
                        <p className="text-xs text-slate-500">{scenario.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {selectedScenario === 'custom' && (
                <textarea value={customScenario} onChange={(e) => setCustomScenario(e.target.value)} placeholder="Describe your scenario..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm h-20 resize-none mt-3" />
              )}
            </div>

            {selectedScenario && selectedColleagues.length > 0 && (
              <button onClick={() => setShowGuidance(true)} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 flex items-center justify-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Get Guidance for {selectedColleagues.length === 1 ? getSelectedColleaguesData()[0].name : `${selectedColleagues.length} People`}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {selectedScenario && selectedColleagues.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <p className="text-amber-800 text-sm">Select team members above to get guidance.</p>
              </div>
            )}

            {showGuidance && selectedScenario && (() => {
              const guidance = generateGuidance();
              if (!guidance) return null;
              const isCustom = selectedScenario === 'custom';
              const scenarioNotes = notes.filter(n => n.context.scenario === selectedScenario || n.context.colleagueIds?.some(id => selectedColleagues.includes(id)));
              return (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <span className="text-2xl">{isCustom ? '✏️' : SCENARIOS.find(s => s.id === selectedScenario)?.icon}</span>
                    <div>
                      <h3 className="font-semibold">{isCustom ? 'Custom Scenario' : SCENARIOS.find(s => s.id === selectedScenario)?.name}</h3>
                      {isCustom && customScenario.trim() && <p className="text-xs text-indigo-600 italic">"{customScenario.trim()}"</p>}
                      <p className="text-sm text-slate-500">{selectedColleagues.length === 1 ? `For ${getSelectedColleaguesData()[0].name}` : `For ${selectedColleagues.length} members`}</p>
                    </div>
                  </div>

                  {scenarioNotes.length > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="font-medium text-amber-800 text-sm mb-2 flex items-center gap-1"><StickyNote className="w-4 h-4" /> Your Notes</p>
                      {scenarioNotes.map(note => (
                        <p key={note.id} className="text-sm text-amber-900 mb-1">• {note.text}</p>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-slate-700">{guidance.overview}</p>
                  
                  {guidance.domainStrategies.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Key Approaches</h4>
                      <div className="space-y-2">
                        {guidance.domainStrategies.map(({domain, strategy}) => (
                          <div key={domain} className={`p-3 rounded-lg ${DOMAIN_COLORS[domain]?.bg || 'bg-slate-100'} border ${DOMAIN_COLORS[domain]?.border || 'border-slate-200'}`}>
                            <p className={`font-medium text-sm ${DOMAIN_COLORS[domain]?.text || 'text-slate-700'}`}>{domain}</p>
                            <p className="text-sm text-slate-700 mt-1">{strategy}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium text-sm mb-2">Individual Tips</h4>
                    <div className="space-y-3">
                      {guidance.individualTips.map(({person, tips}) => (
                        <div key={person} className="bg-slate-50 rounded-lg p-3">
                          <p className="font-medium text-sm mb-2">{person}</p>
                          <div className="space-y-1">
                            {tips.map(({strength, tip}) => (
                              <div key={strength} className="flex gap-2 text-sm">
                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium shrink-0 ${DOMAIN_COLORS[STRENGTHS_DATA[strength]?.domain]?.bg || 'bg-slate-100'} ${DOMAIN_COLORS[STRENGTHS_DATA[strength]?.domain]?.text || 'text-slate-600'}`}>{strength}</span>
                                <span className="text-slate-600">{tip}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <h4 className="font-medium text-sm text-green-800 mb-2">✓ Do</h4>
                      <ul className="space-y-1">{guidance.doList.map((item, i) => <li key={i} className="text-xs text-green-700">• {item}</li>)}</ul>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h4 className="font-medium text-sm text-red-800 mb-2">✗ Avoid</h4>
                      <ul className="space-y-1">{guidance.avoidList.map((item, i) => <li key={i} className="text-xs text-red-700">• {item}</li>)}</ul>
                    </div>
                  </div>

                  {guidance.talkingPoints.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-indigo-600" />
                        Sample Messaging & Talking Points
                      </h4>
                      <div className="space-y-3">
                        {guidance.talkingPoints.map(({ domain, opener, messages, closer }) => (
                          <div key={domain} className={`rounded-lg border ${DOMAIN_COLORS[domain]?.border || 'border-slate-200'} overflow-hidden`}>
                            <div className={`px-3 py-2 ${DOMAIN_COLORS[domain]?.bg || 'bg-slate-100'} border-b ${DOMAIN_COLORS[domain]?.border || 'border-slate-200'}`}>
                              <p className={`font-medium text-sm ${DOMAIN_COLORS[domain]?.text || 'text-slate-700'}`}>For {domain}-dominant colleagues</p>
                            </div>
                            <div className="p-3 bg-white space-y-3">
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Opening</p>
                                <p className="text-sm text-slate-800 italic bg-slate-50 p-2 rounded">"{opener}"</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Key Messages</p>
                                <ul className="space-y-1.5">
                                  {messages.map((msg, i) => (
                                    <li key={i} className="text-sm text-slate-700 bg-slate-50 p-2 rounded flex gap-2">
                                      <span className="text-indigo-500 font-medium">{i + 1}.</span>
                                      <span>"{msg}"</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Closing</p>
                                <p className="text-sm text-slate-800 italic bg-slate-50 p-2 rounded">"{closer}"</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Quick Tips Tab */}
        {colleagues.length > 0 && activeTab === 'communicate' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><MessageCircle className="w-5 h-5 text-indigo-600" /> Quick Tips</h3>
            {selectedColleagues.length > 0 ? (
              <div className="space-y-4">
                {getSelectedColleaguesData().map(person => (
                  <div key={person.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="flex items-center gap-2 p-3 bg-slate-50">
                      <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm">{person.name[0]}</div>
                      <span className="font-medium">{person.name}</span>
                    </div>
                    <div className="p-3 space-y-2">
                      {person.strengths.slice(0, 5).map((s, i) => (
                        <div key={s} className={`p-2 rounded ${DOMAIN_COLORS[STRENGTHS_DATA[s]?.domain]?.bg || 'bg-slate-100'}`}>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-bold text-slate-400">#{i + 1}</span>
                            <span className="font-medium text-sm">{s}</span>
                          </div>
                          <p className="text-xs text-slate-700">{STRENGTHS_DATA[s]?.comm}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">Select team members above.</p>
            )}
          </div>
        )}

        {/* Dynamics Tab */}
        {colleagues.length > 0 && activeTab === 'dynamics' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className="font-semibold mb-3">Team Domain Distribution</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(getTeamDomainDistribution()).map(([domain, count]) => {
                  const total = Object.values(getTeamDomainDistribution()).reduce((a, b) => a + b, 0);
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={domain} className={`p-3 rounded-lg text-center ${DOMAIN_COLORS[domain]?.bg || 'bg-slate-100'} ${DOMAIN_COLORS[domain]?.border || 'border-slate-200'} border`}>
                      <p className={`font-bold text-xl ${DOMAIN_COLORS[domain]?.text || 'text-slate-700'}`}>{pct}%</p>
                      <p className="text-xs font-medium text-slate-600">{domain}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {colleagues.length >= 2 && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h3 className="font-semibold mb-3">Pair Dynamics</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {colleagues.map((c1, i) => 
                    colleagues.slice(i + 1).map(c2 => {
                      const shared = c1.strengths.filter(s => c2.strengths.includes(s));
                      return (
                        <div key={`${c1.id}-${c2.id}`} className="p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{c1.name}</span>
                            <span className="text-slate-400">↔</span>
                            <span className="font-medium text-sm">{c2.name}</span>
                          </div>
                          {shared.length > 0 ? (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">Shared: {shared.join(', ')}</span>
                          ) : (
                            <span className="text-xs text-slate-400">No shared strengths — complementary pairing</span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 p-3 bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="flex flex-wrap gap-2">
            {Object.entries(DOMAIN_COLORS).map(([domain, colors]) => (
              <span key={domain} className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>{domain}</span>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">Built by Bridge5D • CliftonStrengths is a trademark of Gallup, Inc.</p>
        </div>
      </div>
    </div>
  );
}
