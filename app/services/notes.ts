const notes = [
  {
    id: 1,
    title: "Understanding React Server Components",
    author: "Dan Abramov",
    url: "https://example.com/react-server-components",
    likes: 1042
  },
  {
    id: 2,
    title: "Mastering the Next.js App Router",
    author: "Lee Robinson",
    url: "https://example.com/nextjs-app-router",
    likes: 850
  },
  {
    id: 3,
    title: "Why Tailwind CSS is Everywhere",
    author: "Adam Wathan",
    url: "https://example.com/tailwind-css-everywhere",
    likes: 3200
  },
  {
    id: 4,
    title: "How to Fetch Data in Next.js 15",
    author: "Sebastien Lorber",
    url: "https://example.com/nextjs-15-data-fetching",
    likes: 415
  }
];

let nextId = 4;

export const getNotes = () => {
  return notes
}


export const addNote = (title: string, author: string, url: string) => {
  notes.push({id: nextId++, title, author, url, likes: 0}); 
}


export const getNoteById = (id: number) => {
  return notes.find((note) => note.id === id)
}

export const persistLikes = (id: number) => {
  const note = notes.find((note) => note.id === id);

  if (note) {
    note.likes += 1;
    return note;
  }
}