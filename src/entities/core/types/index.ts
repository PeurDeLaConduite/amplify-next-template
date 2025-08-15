// src/entities/core/types/index.ts

// Amplify-based types
export type {
    AmplifyId,
    AmplifyListResult,
    BaseModel,
    CreateOmit,
    UpdateInput,
    ModelForm,
} from "./amplifyBaseTypes";

// Generic model types
export type { ModelId, Timestamps, BaseEntity, Relation, RelationArray } from "./model";

// Form-related types
export type { FormState, EditMode, ValidationResult } from "./form";

// Configuration and auth types
export type {
    FieldKind,
    FieldDef,
    RelationDef,
    IdentifierDef,
    ModelFields,
    ModelConfig,
    AuthRuleConfig as EntitiesAuthRule,
} from "./config";
