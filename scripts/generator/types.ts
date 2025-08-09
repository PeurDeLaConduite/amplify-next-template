export type Field =
  | { name: string; kind: "string" | "number" | "boolean" | "id"; required?: boolean }
  | { name: string; kind: "enum"; required?: boolean; enumValues: string[] }
  | { name: string; kind: "custom"; required?: boolean; refType: string };

export type Assoc =
  | { kind: "hasMany"; target: string; targetFk: string }
  | { kind: "belongsTo"; target: string; fk: string };

export type ModelMeta = {
  name: string;
  type: "model";
  fields: Field[];
  assocs: Assoc[];
  identifier?: string[];
};

export type CustomTypeMeta = {
  name: string;
  type: "customType";
  fields: Field[];
};

export type Meta = ModelMeta | CustomTypeMeta;

export type RelationsMap = Record<
  string,
  Record<
    string,
    | { kind: "hasMany"; child: string; childFk: string }
    | { kind: "manyToMany"; through: string; parentKey: string; childKey: string; child: string }
  >
>;

