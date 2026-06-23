import { Injectable } from "@nestjs/common";

@Injectable()
export class ContractsService {
  create(payload: Record<string, unknown>) {
    return { id: "contract-demo", status: "DRAFT", ...payload };
  }

  detail(id: string) {
    return { id, status: "DRAFT", fileUrl: null };
  }
}
