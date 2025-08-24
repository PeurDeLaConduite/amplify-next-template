# 📘 Glossaire — Conventions de nommage

## Formulaires
- `setFieldValue(field, value)` → maj d’un champ  
- `patchForm(partial)` → maj partielle du form  

## Mode édition
- `enterEditMode(id?)` → activer le mode édition (optionnellement sur un item)  
- `exitEditMode()` → sortir du mode édition  
- `selectItemToEdit(id)` → définir l’item courant à éditer  

## Callbacks (props parent → enfant)
- `onFieldChange(field, value)`  
- `onSaveSuccess({ id, mode })`  

## Handlers internes
- `handleXxx()` → orchestration locale (`handleSubmit`, `handleDeleteClick`)  

## Transformations (pures)
- `toXxx` → `toPostForm`, `toPostCreate`  
- `mapXxxToYyy` → `mapFormToPostInput`  

## Services CRUD (API)
- `createXxx`, `updateXxx`, `deleteXxx`, `listXxx`  

## Bus d’événements (global)
- `emitXxx()`, `onXxxUpdated(cb)`  

## États & refs
- Booléens → `isXxx`, `hasXxx`  
- Refs → `xxxRef`  
- Sélecteurs → `selectXxx`  


## Many-to-Many

### Synchronisation (remplacer toutes les relations)  
  - `replacePostTags(postId, tagIds)`  
  - `replacePostSections(postId, sectionIds)`  
- Convention : `syncEntity2Relations` ou `replaceEntityRelations`  

### Ajout / Retrait d’une relation

  - `toggleRelationTagId(postId, tagId)`  
  - `toggleRelationSectionId(postId, sectionId)`  
- Convention : `toggleRelationXxxId`  