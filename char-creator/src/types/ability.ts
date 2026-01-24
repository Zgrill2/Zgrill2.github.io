export interface Ability {
  category: string;
  name: string;
  description: string;
  rulesText: string;
  bpCost: number | number[]; // Single cost or array for multi-rank
  affinityReq: string; // Raw requirement string like "7B,(9)" or "4R,5(B|R),(12)"
  colorContributions: {
    w: number;
    u: number;
    b: number;
    r: number;
    g: number;
  };
}

export interface AffinityRequirement {
  requirements: AffinityColorReq[];
  total: number;
}

export interface AffinityColorReq {
  colors: string[]; // e.g., ['W'] or ['B', 'R']
  isOr: boolean; // true for (B|R), false for B,R
  amount: number;
}

/**
 * Parse an affinity requirement string into structured format
 * Examples:
 * - "7B,(9)" => { requirements: [{ colors: ['B'], isOr: false, amount: 7 }], total: 9 }
 * - "4R,5(B|R),(12)" => { requirements: [
 *     { colors: ['R'], isOr: false, amount: 4 },
 *     { colors: ['B', 'R'], isOr: true, amount: 5 }
 *   ], total: 12 }
 * - "12W,12G,(30)" => { requirements: [
 *     { colors: ['W'], isOr: false, amount: 12 },
 *     { colors: ['G'], isOr: false, amount: 12 }
 *   ], total: 30 }
 */
export function parseAffinityReq(reqString: string): AffinityRequirement {
  const result: AffinityRequirement = {
    requirements: [],
    total: 0,
  };

  if (!reqString || reqString.trim() === '') {
    return result;
  }

  // Extract total from last parentheses
  const totalMatch = reqString.match(/\((\d+)\)[^\(]*$/);
  if (totalMatch) {
    result.total = parseInt(totalMatch[1], 10);
  }

  // Split by comma but be careful with parentheses
  const parts = reqString.split(',').filter(p => p.trim() && !p.trim().match(/^\(\d+\)$/));

  for (const part of parts) {
    const trimmed = part.trim();

    // Check if it's an OR requirement like "5(B|R)" (with parentheses)
    const orMatch = trimmed.match(/(\d+)\(([A-Z\|]+)\)/);
    if (orMatch) {
      const amount = parseInt(orMatch[1], 10);
      const colors = orMatch[2].split('|');
      result.requirements.push({
        colors,
        isOr: true,
        amount,
      });
      continue;
    }

    // Check if it's an OR requirement like "9R|G" (without parentheses)
    const orMatchNoParen = trimmed.match(/(\d+)([A-Z](?:\|[A-Z])+)/);
    if (orMatchNoParen) {
      const amount = parseInt(orMatchNoParen[1], 10);
      const colors = orMatchNoParen[2].split('|');
      result.requirements.push({
        colors,
        isOr: true,
        amount,
      });
      continue;
    }

    // Check if it's a simple requirement like "7B" or "12W"
    const simpleMatch = trimmed.match(/(\d+)([A-Z])/);
    if (simpleMatch) {
      const amount = parseInt(simpleMatch[1], 10);
      const color = simpleMatch[2];
      result.requirements.push({
        colors: [color],
        isOr: false,
        amount,
      });
    }
  }

  return result;
}

/**
 * Parse multi-rank affinity requirement string into array of requirements
 * Multi-rank requirements are separated by \r\n
 * Example: "12W,(15)\r\n16W,(21)\r\n20W,(27)" becomes:
 * [
 *   { requirements: [{ colors: ['W'], isOr: false, amount: 12 }], total: 15 },
 *   { requirements: [{ colors: ['W'], isOr: false, amount: 16 }], total: 21 },
 *   { requirements: [{ colors: ['W'], isOr: false, amount: 20 }], total: 27 }
 * ]
 */
export function parseAffinityReqByRank(reqString: string): AffinityRequirement[] {
  if (!reqString || !reqString.trim()) {
    return [{ requirements: [], total: 0 }];
  }

  // Split by newlines (handles both \r\n and \n)
  const lines = reqString.split(/\r?\n/).filter(line => line.trim());

  // If only one line, return single requirement in array
  if (lines.length === 1) {
    return [parseAffinityReq(lines[0])];
  }

  // Parse each line as separate rank requirement
  return lines.map(line => parseAffinityReq(line));
}

/**
 * Get affinity requirement for a specific rank
 * Returns the requirement at the given rank index, or the first rank if index is out of bounds
 */
export function getAffinityReqForRank(reqString: string, rank: number): AffinityRequirement {
  const reqs = parseAffinityReqByRank(reqString);
  return reqs[rank] || reqs[0] || { requirements: [], total: 0 };
}

/**
 * Check if character's affinities meet an ability's requirement
 */
export function meetsAffinityReq(
  charAffinities: { w: number; u: number; b: number; r: number; g: number },
  requirement: AffinityRequirement
): boolean {
  // Check total affinity points
  const totalAffinities = charAffinities.w + charAffinities.u + charAffinities.b + charAffinities.r + charAffinities.g;
  if (totalAffinities < requirement.total) {
    return false;
  }

  // Check each color requirement
  for (const req of requirement.requirements) {
    if (req.isOr) {
      // OR requirement: sum of the specified colors must meet the amount
      // e.g., 9R|G means 9 total points from R and/or G combined
      const totalInColors = req.colors.reduce((sum, color) => {
        const colorKey = color.toLowerCase() as 'w' | 'u' | 'b' | 'r' | 'g';
        return sum + charAffinities[colorKey];
      }, 0);
      if (totalInColors < req.amount) {
        return false;
      }
    } else {
      // AND requirement: the specific color must meet the amount
      const color = req.colors[0];
      const colorKey = color.toLowerCase() as 'w' | 'u' | 'b' | 'r' | 'g';
      if (charAffinities[colorKey] < req.amount) {
        return false;
      }
    }
  }

  return true;
}
