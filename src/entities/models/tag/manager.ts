import { createManager } from "@entities/core/createManager";
import { tagService } from "./service";
import { postService } from "@entities/models/post/service";
import { postTagService } from "@entities/relations/postTag/service";
import { initialTagForm, toTagForm, toTagCreate, toTagUpdate } from "./form";
import type { TagType, TagFormType } from "./types";

type Extras = { posts: { id: string; title?: string }[] };

export function createTagManager() {
  return createManager<TagType, TagFormType, string, Extras>({
    service: {
      list: tagService.list,
      get: tagService.get,
      create: tagService.create,
      update: tagService.update,
      delete: tagService.delete,
    },
    initialForm: initialTagForm,
    toCreate: toTagCreate,
    toUpdate: toTagUpdate,
    toForm: (tag) => toTagForm(tag, []),
    loadExtras: async () => {
      const [posts] = await Promise.all([postService.list()]);
      return { posts: posts.data ?? [] };
    },
    // N:N via PostTag
    syncManyToMany: async (tagId, link) => {
      const { add = [], remove = [], replace } = link;
      const toAdd = replace ? replace : add;
      // add
      await Promise.all(toAdd.map((postId) => postTagService.create(postId, tagId)));
      // remove
      await Promise.all((replace ? [] : remove).map((postId) => postTagService.delete(postId, tagId)));
      // NB: si replace défini on peut l’implémenter autrement (liste actuelle → replace)
    },
  });
}
