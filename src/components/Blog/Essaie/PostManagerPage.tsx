"use client";
import React, { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

import PostList from "./PostList";
import PostForm from "./PostForm";

Amplify.configure(outputs);
const client = generateClient<Schema>();

export default function PostManagerPage() {
  const [posts, setPosts] = useState<Schema["Post"]["type"][]>([]);
  const [editingPost, setEditingPost] = useState<Schema["Post"]["type"] | null>(null);

  const fetchPosts = async () => {
    const { data } = await client.models.Post.list();
    setPosts(data ?? []);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post: Schema["Post"]["type"]) => setEditingPost(post);
  const handleCreatedOrUpdated = () => {
    setEditingPost(null);
    fetchPosts();
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Posts</h1>
      <PostForm post={editingPost} onSave={handleCreatedOrUpdated} />
      <PostList posts={posts} onEdit={handleEdit} onDelete={fetchPosts} />
    </div>
  );
}
