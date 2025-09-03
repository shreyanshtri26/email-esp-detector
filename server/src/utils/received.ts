type Hop = {
    raw: string;
    by?: string;
    from?: string;
    with?: string;
    id?: string;
    date?: string;
  };
  
  export function extractReceivedRaw(headerLines: Array<{ key: string; line: string }>): string[] {
    return headerLines
      .filter((h) => h.key.toLowerCase() === 'received')
      .map((h) => h.line.replace(/^received:\s*/i, '').trim());
  }
  
  // very light parser for common tokens in Received hops
  export function parseReceivedHops(raw: string[]): Hop[] {
    return raw.map((line) => {
      const hop: Hop = { raw: line };
  
      const byMatch = line.match(/\bby\s+([^;()]+?)(?:\s+with|\s+id|\s*;|$)/i);
      if (byMatch) hop.by = byMatch[1].trim();
  
      const fromMatch = line.match(/\bfrom\s+([^;()]+?)(?:\s+by|\s+with|\s+id|\s*;|$)/i);
      if (fromMatch) hop.from = fromMatch[1].trim();
  
      const withMatch = line.match(/\bwith\s+([A-Za-z0-9\-._+]+)(?:\s+|;|$)/i);
      if (withMatch) hop.with = withMatch[1].trim();
  
      const idMatch = line.match(/\bid\s+([A-Za-z0-9\-._]+)(?:\s+|;|$)/i);
      if (idMatch) hop.id = idMatch[1].trim();
  
      const dateMatch = line.match(/;\s*(.*)$/);
      if (dateMatch) hop.date = dateMatch[1].trim();
  
      return hop;
    });
  }
  