import { parse, type MemberExpression } from 'acorn'
import { simple as acornSimple } from 'acorn-walk'

export function analyzeFormRuleCode(code: string) {
  const usedPropertyCodes = new Set<string>()
  const assignedPropertyCodes = new Set<string>()

  const parsedCode = parse(code, { ecmaVersion: 'latest' })
  acornSimple(parsedCode, {
    MemberExpression: (node) => {
      const foundPropertyCode = findPropertyCode(node)
      if (!foundPropertyCode) return

      usedPropertyCodes.add(foundPropertyCode)
    },
    AssignmentExpression: (node) => {
      if (node.left.type !== 'MemberExpression') return

      const foundPropertyCode = findPropertyCode(node.left)
      if (!foundPropertyCode) return

      assignedPropertyCodes.add(foundPropertyCode)
    }
  })

  return {
    usedPropertyCodes: Array.from(usedPropertyCodes),
    assignedPropertyCodes: Array.from(assignedPropertyCodes)
  }
}

function findPropertyCode(memberExpression: MemberExpression) {
  const memberPath = constructMemberExpressionPath({
    member: memberExpression
  })

  return extractUsedPropertyCode(memberPath)
}

function constructMemberExpressionPath({
  member,
  childrenPath = []
}: {
  member: MemberExpression
  childrenPath?: string[]
}): string[] {
  let propertyName = ''
  switch (member.property.type) {
    case 'Identifier':
      propertyName = member.property.name
      break
    case 'Literal':
      propertyName = member.property.value as string
      break
    default:
      return []
  }

  switch (member.object.type) {
    case 'Identifier':
      return [member.object.name, propertyName, ...childrenPath]
    case 'MemberExpression':
      return constructMemberExpressionPath({
        member: member.object,
        childrenPath: [propertyName, ...childrenPath]
      })
  }

  return []
}

function extractUsedPropertyCode(path: string[]) {
  return path[0] === 'cx' ? path[1] ?? undefined : undefined
}
