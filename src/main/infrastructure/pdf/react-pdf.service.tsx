import { Injectable } from "@nestjs/common";
import ReactPDF from "@react-pdf/renderer";
import { PDFService } from "core/ports/pdf/pdf.service";
import { Readable } from "stream";

@Injectable()
export class ReactPDFService implements PDFService {
  async generatePDF(
    Component: React.ComponentType<any>,
    props: React.ComponentProps<any>,
  ): Promise<Readable> {
    const stream = await ReactPDF.renderToStream(<Component {...props} />);

    return new Readable().wrap(stream);
  }
}
