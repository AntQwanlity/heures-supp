import { CheckIcon } from "@heroicons/react/20/solid";
import { ButtonLink } from "presentation/web/core/shared/buttons/button-link";
import { Icon } from "presentation/web/core/shared/icons/icon";
import React, { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

type Props = {
  valueToCopy: string;
  copyText?: string;
  timeout?: number;
};

export const CopyToClipboardButton: React.FC<Props> = ({
  valueToCopy,
  copyText = "Copier",
  timeout = 5000,
}: Props) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timeoutId = window.setTimeout(() => {
        setCopied(false);
      }, timeout);
      return () => window.clearInterval(timeoutId);
    }
    return () => {};
  }, [copied, timeout]);
  return (
    <CopyToClipboard text={valueToCopy} onCopy={() => setCopied(true)}>
      {copied ? (
        <span className="text-green-400 hover:text-green-400">
          <Icon Component={CheckIcon} /> Copié
        </span>
      ) : (
        <ButtonLink>{copyText}</ButtonLink>
      )}
    </CopyToClipboard>
  );
};
