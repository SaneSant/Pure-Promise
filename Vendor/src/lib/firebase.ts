import { initializeApp } from 'firebase/app';
import {
	createUserWithEmailAndPassword,
	updateProfile,
	type Auth,
	signInWithEmailAndPassword
} from 'firebase/auth';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	getFirestore,
	query,
	serverTimestamp,
	setDoc,
	where
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyDcZBBvr-rhuJmf2bG1m6-XMIM7bXBn6C8',
	authDomain: 'pure-promise.firebaseapp.com',
	projectId: 'pure-promise',
	storageBucket: 'pure-promise.appspot.com',
	messagingSenderId: '46657508467',
	appId: '1:46657508467:web:ceb67643ab5f2ef06b8606',
	measurementId: 'G-WQH754YE8G'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);

// create new account and update display name
export const createUser = async (
	auth: Auth,
	email: string,
	password: string,
	displayName: string
) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		await updateProfile(userCredential.user, { displayName });
		return { type: 'success' };
	} catch (error) {
		return { type: 'error', error };
	}
};

// login with email and password
export const login = async (auth: Auth, email: string, password: string) => {
	try {
		await signInWithEmailAndPassword(auth, email, password);
		return { type: 'success' };
	} catch (error) {
		return { type: 'error', error };
	}
};

// upload item image to firebase storage
export const uploadItemImage = async (files: FileList) => {
	const urls = [];
	const storage = getStorage(app);
	const storageRef = ref(storage, 'items');
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const fileRef = ref(storageRef, file.name);
		await uploadBytes(fileRef, file);
		const url = await getDownloadURL(fileRef);
		urls.push(url);
	}
	return urls;
};

export interface Item {
	id?: string;
	userID: string;
	name: string;
	shortDescription: string;
	longDescription: string;
	price: string;
	category: string;
	image: string[];
}

// add item to firestore
export const addItem = async (item: Item) => {
	try {
		await addDoc(collection(firestore, 'items'), item);
		return { type: 'success' };
	} catch (error) {
		return { type: 'error', error };
	}
};

// get items with specific category
export const getItemsCatefory = async (category: string) => {
	const items: Item[] = [];
	// console.log(category);
	const querySnapshot = await getDocs(
		query(collection(firestore, 'items'), where('category', '==', category))
	);
	// biome-ignore lint/complexity/noForEach: <explanation>
	querySnapshot.forEach((doc) => {
		const itemData = doc.data();
		itemData.id = doc.id;
		items.push(itemData as Item);
	});
	return items;
};

// get item by ID
export const getItemByID = async (id: string) => {
	const docRef = doc(firestore, 'items', id);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const itemData = docSnap.data();
		itemData.id = docSnap.id;
		return itemData as Item;
	}
	return null;
};

// get all items
export const getAllItems = async () => {
	const items: Item[] = [];
	const querySnapshot = await getDocs(collection(firestore, 'items'));
	// biome-ignore lint/complexity/noForEach: <explanation>
	querySnapshot.forEach((doc) => {
		const itemData = doc.data();
		itemData.id = doc.id;
		items.push(itemData as Item);
	});
	return items;
};

// remove item by ID
export const removeItem = async (id: string) => {
	await setDoc(doc(firestore, 'items', id), { removed: true }, { merge: true });
};

// add to cart
export const addToCart = async (userID: string, itemID: string) => {
	const docRef = doc(firestore, 'users', userID);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const userData = docSnap.data();
		if (!userData.cart) {
			userData.cart = [];
		}
		// check if item is already in cart
		if (userData.cart.includes(itemID)) {
			return userData.cart;
		}
		userData.cart.push(itemID);
		await setDoc(docRef, userData);
		return userData.cart;
	}

	await setDoc(docRef, { cart: [itemID] });
	return [itemID];
};

// get cart
export const getCart = async (userID: string) => {
	const docRef = doc(firestore, 'users', userID);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const userData = docSnap.data();
		if (!userData.cart) {
			userData.cart = [];
		}
		return userData.cart;
	}
	return [];
};

// remove from cart
export const removeFromCart = async (userID: string, itemID: string) => {
	const docRef = doc(firestore, 'users', userID);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const userData = docSnap.data();
		if (!userData.cart) {
			userData.cart = [];
		}
		userData.cart = userData.cart.filter((id: string) => id !== itemID);
		await setDoc(docRef, userData);
	}
};

// add purchase
export const addPurchase = async (userID: string, email: string, name: string, itemID: string) => {
	const collectionRef = collection(firestore, 'purchases');
	await addDoc(collectionRef, {
		email,
		name,
		itemID,
		createdAt: serverTimestamp(),
		userID
	});
	await removeFromCart(userID, itemID);
};

// get item id list by user id
export const getItemsByUserID = async (userID: string) => {
	const itemIDs: string[] = [];
	const querySnapshot = await getDocs(
		query(collection(firestore, 'items'), where('userID', '==', userID))
	);
	// biome-ignore lint/complexity/noForEach: <explanation>
	querySnapshot.forEach((doc) => {
		itemIDs.push(doc.id);
	});
	return itemIDs;
};

// get item data list by user id
export const getItemsDataByUserID = async (userID: string) => {
	const items: Item[] = [];
	const querySnapshot = await getDocs(
		query(collection(firestore, 'items'), where('userID', '==', userID))
	);
	// biome-ignore lint/complexity/noForEach: <explanation>
	querySnapshot.forEach((doc) => {
		const itemData = doc.data();
		itemData.id = doc.id;
		items.push(itemData as Item);
	});
	return items;
};

export interface PurchaseData {
	email: string;
	name: string;
	itemID: string;
	createdAt: string;
	userID: string;
}

// get purchase list by user id
export const getPurchasesByUserID = async (userID: string) => {
	const userItems = await getItemsByUserID(userID);
	const q = query(collection(firestore, 'purchases'), where('itemID', 'in', userItems));
	const querySnapshot = await getDocs(q);
	const purchases: PurchaseData[] = [];

	// biome-ignore lint/complexity/noForEach: <explanation>
	querySnapshot.forEach((doc) => {
		const purchaseData = doc.data();
		purchaseData.id = doc.id;
		purchases.push(purchaseData as PurchaseData);
	});

	const items: Item[] = [];

	for (const item of userItems) {
		const itemData = await getItemByID(item);
		if (itemData) {
			items.push(itemData);
		}
	}

	// combine purchases and items
	const purchasesWithItems = purchases.map((purchase) => {
		const item = items.find((item) => item.id === purchase.itemID);
		return { ...purchase, item };
	});

	// order by createdAt
	purchasesWithItems.sort((b, a) => {
		if (a.createdAt < b.createdAt) {
			return 1;
		}
		if (a.createdAt > b.createdAt) {
			return -1;
		}
		return 0;
	});

	return purchasesWithItems;
};

// get Purchase by userID
export const getPurchaseByUserID = async (userID: string) => {
	const querySnapshot = await getDocs(
		query(collection(firestore, 'purchases'), where('userID', '==', userID))
	);
	const purchases: PurchaseData[] = [];

	// biome-ignore lint/complexity/noForEach: <explanation>
	querySnapshot.forEach((doc) => {
		const purchaseData = doc.data();
		purchaseData.id = doc.id;
		purchases.push(purchaseData as PurchaseData);
	});

	const items: Item[] = [];

	for (const purchase of purchases) {
		const itemData = await getItemByID(purchase.itemID);
		if (itemData) {
			items.push(itemData);
		}
	}

	// combine purchases and items
	const purchasesWithItems = purchases.map((purchase) => {
		const item = items.find((item) => item.id === purchase.itemID);
		return { ...purchase, item };
	});

	// order by createdAt
	purchasesWithItems.sort((b, a) => {
		if (a.createdAt < b.createdAt) {
			return 1;
		}
		if (a.createdAt > b.createdAt) {
			return -1;
		}
		return 0;
	});

	return purchasesWithItems;
};

// get purchase by id
export const getPurchaseByID = async (purchaseID: string) => {
	const docRef = doc(firestore, 'purchases', purchaseID);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		const purchaseData = docSnap.data();
		purchaseData.id = docSnap.id;
		return purchaseData;
	}
	return null;
};

export interface Review {
	purchaseID: string;
	review: string;
	createdAt: string;
	itemID: string;
	userID: string;
	rating: number;
	id: string;
}

// get reviews by item id
export const getReviewsByItemID = async (itemID: string) => {
	const querySnapshot = await getDocs(
		query(collection(firestore, 'reviews'), where('itemID', '==', itemID))
	);
	const reviews: Review[] = [];

	// biome-ignore lint/complexity/noForEach: <explanation>
	querySnapshot.forEach((doc) => {
		const reviewData = doc.data();
		reviewData.id = doc.id;
		reviews.push(reviewData as Review);
	});

	// order by createdAt
	reviews.sort((b, a) => {
		if (a.createdAt < b.createdAt) {
			return 1;
		}
		if (a.createdAt > b.createdAt) {
			return -1;
		}
		return 0;
	});

	return reviews;
};
