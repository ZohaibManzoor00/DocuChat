"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import { collection, doc } from "firebase/firestore";
import { db } from "../../firebase";

const PRO_LIMIT = 20;
const FREE_LIMIT = 2;

export const useSubscription = () => {
  const [isPro, setIsPro] = useState(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);

  const { user } = useUser();

  const [snapshot, loading, error] = useDocument(
    user && doc(db, "users", user.id),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [filesSnapshot, filesLoading] = useCollection(
    user && collection(db, "users", user?.id, "files")
  );

  useEffect(() => {
    if (!snapshot) return;

    const data = snapshot.data();

    if (!data) return;

    setIsPro(data.isPro);
  }, [snapshot]);

  useEffect(() => {
    if (!filesSnapshot || isPro === null) return;

    const files = filesSnapshot.docs;
    const usersLimit = isPro ? PRO_LIMIT : FREE_LIMIT;

    setIsOverFileLimit(files.length >= usersLimit);
  }, [filesSnapshot, isPro]);

  return { isOverFileLimit, isPro, loading, error, filesLoading };
};
