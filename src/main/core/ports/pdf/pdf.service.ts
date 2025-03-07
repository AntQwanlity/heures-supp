import React from "react";
import { Readable } from "stream";

export abstract class PDFService {
  abstract generatePDF(
    Component: React.ComponentType<any>,
    props: React.ComponentProps<any>,
  ): Promise<Readable>;
}
