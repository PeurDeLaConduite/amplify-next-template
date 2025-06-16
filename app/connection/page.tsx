"use client";

import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "../../amplify_outputs.json";
import Authentication from "@/src/components/Authentication/Authentication";

Amplify.configure(outputs);

export default function ConnectionPage() {
    return <Authentication />;
}
