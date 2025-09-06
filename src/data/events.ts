export interface Event {
    id: string;
    name: string;
    category: "technical" | "non-technical";
    description: string;
    price: number;
    image: string; // URL to the event image
    deadline: string; // ISO date string
    maxParticipants?: number; // Optional, for team events
    requiresTeam?: boolean; // Optional, indicates if the event requires a team
    teamSize?: number; // Optional, size of the team if requiresTeam is true
    requiresGameIds?: boolean; // Optional, indicates if game IDs are required for esports events
}

export const events: Event[] = [
    // Technical Events
    {
        id: "web-dev",
        name: "Web Development Challenge",
        category: "technical",
        description:
            "Team of 3 members will build a complete website based on given theme and requirements.",
        price: 100,
        teamSize: 3 ,
        image: "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800",
        deadline: "2025-09-15",
    },
    {
        id: "poster-presentation",
        name: "Poster Presentation",
        category: "technical",
        description:
            "Team of 2 members will bulid a poster related to technology.",
        price: 100,
        teamSize: 2 ,
        image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800",
        deadline: "2025-09-15",
    },
    {
        id: "techexpo",
        name: "Tech Expo",
        category: "technical",
        description:
            "Team of 3 members will showcase your innovative technology projects and prototypes to college experts.",
        price: 100,
        teamSize: 3 ,
        image: "https://images.pexels.com/photos/8636654/pexels-photo-8636654.jpeg?auto=compress&cs=tinysrgb&w=800",
        deadline: "2025-09-15",
    },
    {
        id: "pycharm",
        name: "PyMaster Contest",
        category: "technical",
        description:
            "Only one participant will solve complex programming challenges using Python and demonstrate your algorithmic skills.",
        price: 50,
        teamSize: 1 ,
        image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800",
        deadline: "2025-09-15",
    },
    {
        id: "technical-quiz",
        name: "Technical Quiz",
        category: "technical",
        description:
            "Contain team of 3 members. Test your knowledge across various technical domains in this comprehensive quiz competition.",
        price: 100,
        teamSize: 3 ,
        image: "https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800",
        deadline: "2025-09-15",
    },
    // Non-Technical Events
    {
        id: "photo-contest",
        name: "Photography Contest",
        category: "non-technical",
        description:
            "Single participant. Capture the world through your lens and compete your photography on CACHE2K25 Instagram page.",
        price: 50,
        teamSize: 1 ,
        image: "https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg?auto=compress&cs=tinysrgb&w=800",
        deadline: "2025-09-15",
    },
    {
        id: "live-drawing",
        name: "Live Drawing",
        category: "non-technical",
        description:
            "Single participant.You should draw instantly according to the topic provided. You have to carry your own equipment. Time slot will be selected",
        price: 50,
        teamSize: 1 ,
        image: "https://images.pexels.com/photos/606541/pexels-photo-606541.jpeg?auto=compress&cs=tinysrgb&w=800",
        deadline: "2025-09-15",
    },
    {
        id: "tech-meme-contest",
        name: "Tech Meme Contest",
        category: "non-technical",
        description:
            "Single participant. Create hilarious memes about technology and any others. (Note: Do not include any political, college, faculty and sensitive content)",
        price: 50,
        teamSize: 1 ,
        image: "https://images.pexels.com/photos/4974915/pexels-photo-4974915.jpeg?auto=compress&cs=tinysrgb&w=800",
        deadline: "2025-09-15",
    },
    {
        id: "bgmi-esports",
        name: "BGMI Esports Tournament",
        category: "non-technical",
        description:
            "You have to carry your own device along with your own internet (No routers, Wifi provided) . No facilities provided related to gaming.",
        price: 200,
        maxParticipants: 4,
        requiresTeam: true,
        teamSize: 4,
        requiresGameIds: true,
        image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800",
        deadline: "2025-09-15",
    },
    {
        id: "freefire-esports",
        name: "Free Fire Esports Championship",
        category: "non-technical",
        description:
            "You have to carry your own device along with your own internet  (No routers, Wifi provided). No facilities provided related to gaming.",
        price: 200,
        maxParticipants: 4,
        requiresTeam: true,
        teamSize: 4,
        requiresGameIds: true,
        image: "https://images.pexels.com/photos/3945313/pexels-photo-3945313.jpeg?auto=compress&cs=tinysrgb&w=800",
        deadline: "2025-09-15",
    },
];
