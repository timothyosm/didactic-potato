import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  QueryClient,
  QueryClientProvider as QueryClientProviderBase,
  hashQueryKey,
  useQuery,
} from "react-query";
import { firebaseApp } from "./firebase";

// Initialize Firestore
const db = getFirestore(firebaseApp);

// React Query client
const client = new QueryClient();

export function createSession(data) {
  return addDoc(collection(db, "sessions"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export function addParticipantToSession(sessionId, participant) {
  // Reference to the specific session
  const sessionRef = doc(db, "sessions", sessionId);

  // Update the session's participants array
  return updateDoc(sessionRef, {
    participants: arrayUnion(participant),
  });
}

// Fetch all sessions where a specific user is a participant
export function useGetSessionsForUser(userId) {
  return useQuery(
    ["sessions", { userId }],
    createQuery(() =>
      query(
        collection(db, "sessions"),
        // where("participants", "array-contains", userId),
        orderBy("createdAt", "desc")
      )
    )
  );
}

export function useGetSessionById(id) {
  return useQuery(
    ["sessions", { id }],
    createQuery(() => doc(db, "sessions", id)),
    { enabled: !!id }
  );
}

export async function resetRevealAndNumbers(sessionId) {
  // Reference to the specific session
  const sessionRef = doc(db, "sessions", sessionId);

  // Fetch current session data
  const sessionDoc = await getDoc(sessionRef);
  if (!sessionDoc.exists()) {
    throw new Error("Session not found");
  }

  const sessionData = sessionDoc.data();
  const participants = sessionData.participants || [];

  // Iterate through each participant and set their number to null
  participants.forEach((participant) => {
    participant.number = null;
  });

  // Update the 'reveal' field to false and the participants array in Firestore
  await updateDoc(sessionRef, {
    reveal: false,
    participants: participants,
  });
}

export async function updateRevealStatus(sessionId, revealStatus) {
  // Validate the input to ensure it's a boolean
  if (typeof revealStatus !== "boolean") {
    throw new Error("'revealStatus' should be a boolean");
  }

  // Reference to the specific session
  const sessionRef = doc(db, "sessions", sessionId);

  // Update the 'reveal' field in Firestore
  await updateDoc(sessionRef, {
    reveal: revealStatus,
  });
}

export async function toggleObserverStatus(sessionId, participantId) {
  // Reference to the specific session
  const sessionRef = doc(db, "sessions", sessionId);

  // Fetch current session data
  const sessionDoc = await getDoc(sessionRef);
  if (!sessionDoc.exists()) {
    throw new Error("Session not found");
  }

  const sessionData = sessionDoc.data();
  const participants = sessionData.participants || [];

  // Find the participant by ID and toggle the 'observer' field
  const participantIndex = participants.findIndex(
    (p) => p.id === participantId
  );
  if (participantIndex === -1) {
    throw new Error("Participant not found");
  }

  // Toggle observer boolean. If it doesn't exist, it defaults to false and becomes true.
  participants[participantIndex].observer =
    !participants[participantIndex].observer;

  // Update the participants array in Firestore
  await updateDoc(sessionRef, {
    participants: participants,
  });
}

export async function updateParticipantNumber(
  sessionId,
  participantId,
  newNumber
) {
  // Reference to the specific session
  const sessionRef = doc(db, "sessions", sessionId);

  // Fetch current session data
  const sessionDoc = await getDoc(sessionRef);
  if (!sessionDoc.exists()) {
    throw new Error("Session not found");
  }

  const sessionData = sessionDoc.data();
  const participants = sessionData.participants || [];

  // Find the participant by ID and update the number
  const participantIndex = participants.findIndex(
    (p) => p.id === participantId
  );
  if (participantIndex === -1) {
    throw new Error("Participant not found");
  }
  participants[participantIndex].number = newNumber;

  // Update the participants array in Firestore
  await updateDoc(sessionRef, {
    participants: participants,
  });
}

export function useGetUserById(id) {
  return useQuery(
    ["users", { id }],

    () => getDoc(doc(db, "users", id)).then(format),
    { enabled: !!id }
  );
}

/**** USERS ****/

// Subscribe to user data
// Note: This is called automatically in `auth.js` and data is merged into `auth.user`
export function useUser(uid) {
  // Manage data fetching with React Query: https://react-query.tanstack.com/overview
  return useQuery(
    // Unique query key: https://react-query.tanstack.com/guides/query-keys
    ["user", { uid }],
    // Query function that subscribes to data and auto-updates the query cache
    createQuery(() => doc(db, "users", uid)),
    // Only call query function if we have a `uid`
    { enabled: !!uid }
  );
}

// Fetch user data once (non-hook)
// Useful if you need to fetch data from outside of a component
export function getUser(uid) {
  return getDoc(doc(db, "users", uid)).then(format);
}

// Create a new user
export function createUser(uid, data) {
  return setDoc(doc(db, "users", uid), data, { merge: true });
}

// Update an existing user
export function updateUser(uid, data) {
  return updateDoc(doc(db, "users", uid), data);
}

/**** ITEMS ****/
/* Example query functions (modify to your needs) */

// Subscribe to item data
export function useItem(id) {
  return useQuery(
    ["item", { id }],
    createQuery(() => doc(db, "items", id)),
    { enabled: !!id }
  );
}

// Fetch item data once
export function useItemOnce(id) {
  return useQuery(
    ["item", { id }],
    // When fetching once there is no need to use `createQuery` to setup a subscription
    // Just fetch normally using `getDoc` so that we return a promise
    () => getDoc(doc(db, "items", id)).then(format),
    { enabled: !!id }
  );
}

// Subscribe to all items by owner
export function useItemsByOwner(owner) {
  return useQuery(
    ["items", { owner }],
    createQuery(() =>
      query(
        collection(db, "items"),
        where("owner", "==", owner),
        orderBy("createdAt", "desc")
      )
    ),
    { enabled: !!owner }
  );
}

// Create a new item
export function createItem(data) {
  return addDoc(collection(db, "items"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// Update an item
export function updateItem(id, data) {
  return updateDoc(doc(db, "items", id), data);
}

// Delete an item
export function deleteItem(id) {
  return deleteDoc(doc(db, "items", id));
}

/**** HELPERS ****/

// Store Firestore unsubscribe functions
const unsubs = {};

function createQuery(getRef) {
  // Create a query function to pass to `useQuery`
  return async ({ queryKey }) => {
    let unsubscribe;
    let firstRun = true;
    // Wrap `onSnapshot` with a promise so that we can return initial data
    const data = await new Promise((resolve, reject) => {
      unsubscribe = onSnapshot(
        getRef(),
        // Success handler resolves the promise on the first run.
        // For subsequent runs we manually update the React Query cache.
        (response) => {
          const data = format(response);
          if (firstRun) {
            firstRun = false;
            resolve(data);
          } else {
            client.setQueryData(queryKey, data);
          }
        },
        // Error handler rejects the promise on the first run.
        // We can't manually trigger an error in React Query, so on a subsequent runs we
        // invalidate the query so that it re-fetches and rejects if error persists.
        (error) => {
          if (firstRun) {
            firstRun = false;
            reject(error);
          } else {
            client.invalidateQueries(queryKey);
          }
        }
      );
    });

    // Unsubscribe from an existing subscription for this `queryKey` if one exists
    // Then store `unsubscribe` function so it can be called later
    const queryHash = hashQueryKey(queryKey);
    unsubs[queryHash] && unsubs[queryHash]();
    unsubs[queryHash] = unsubscribe;

    return data;
  };
}

// Automatically remove Firestore subscriptions when all observing components have unmounted
client.queryCache.subscribe(({ type, query }) => {
  if (
    type === "observerRemoved" &&
    query.getObserversCount() === 0 &&
    unsubs[query.queryHash]
  ) {
    // Call stored Firestore unsubscribe function
    unsubs[query.queryHash]();
    delete unsubs[query.queryHash];
  }
});

// Format Firestore response
function format(response) {
  // Converts doc into object that contains data and `doc.id`
  const formatDoc = (doc) => ({ id: doc.id, ...doc.data() });
  if (response.docs) {
    // Handle a collection of docs
    return response.docs.map(formatDoc);
  } else {
    // Handle a single doc
    return response.exists() ? formatDoc(response) : null;
  }
}

// React Query context provider that wraps our app
export function QueryClientProvider(props) {
  return (
    <QueryClientProviderBase client={client}>
      {props.children}
    </QueryClientProviderBase>
  );
}
