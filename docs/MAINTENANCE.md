# Documentation Maintenance Guide

This document outlines how to keep the documentation up-to-date and organized.

## Documentation Structure

All documentation files are located in the `docs/` folder. The main project README remains in the root directory.

```
testlab-1/
├── README.md              # Main project overview (keep in root)
└── docs/
    ├── README.md          # Documentation index
    ├── SUMMARY.md         # Quick summary
    ├── MAINTENANCE.md     # This file
    └── [other docs...]    # All other documentation
```

## When to Update Documentation

### Always Update
- **CHANGELOG.md** - When making any code changes
- **IMPLEMENTATION_STATUS.md** - When features are completed or issues are found
- **API_REFERENCE.md** - When APIs change (RPC functions, edge functions)

### Update When Relevant
- **QUICK_START.md** - When setup process changes
- **EDGE_FUNCTIONS_SETUP.md** - When edge functions are deployed/updated
- **DESIGN_SYSTEM.md** - When design patterns change
- **IMPLEMENTATION_GUIDE.md** - When new patterns are established
- **SHARED_PATTERNS_FROM_OTHER_PROJECTS.md** - When new patterns are discovered

### Update Periodically
- **SUMMARY.md** - Keep current status accurate
- **DOCUMENTATION.md** - Update recent changes section
- **README.md** (docs) - Keep index current

## Update Checklist

When making changes to the codebase:

- [ ] Update CHANGELOG.md with changes
- [ ] Update IMPLEMENTATION_STATUS.md if features completed/fixed
- [ ] Update API_REFERENCE.md if APIs changed
- [ ] Update relevant guide if process changed
- [ ] Update SUMMARY.md if status changed
- [ ] Verify all links still work

## Documentation Standards

### File Naming
- Use descriptive names with spaces: `IMPLEMENTATION_STATUS.md`
- Use PascalCase for acronyms: `API_REFERENCE.md`
- Keep names consistent with content

### Structure
- Start with a clear title and overview
- Use descriptive headings
- Include code examples where helpful
- Link to related documents
- Add "Last Updated" date when significant

### Links
- Use relative paths: `./QUICK_START.md`
- Link to root README: `../README.md`
- Keep links updated when files move

### Code Examples
- Keep examples current with actual code
- Include necessary context
- Show both before/after when relevant
- Test examples periodically

## Adding New Documentation

1. **Create the file** in `docs/` folder
2. **Add to docs/README.md** index
3. **Update SUMMARY.md** if it's a major document
4. **Link from relevant docs** where appropriate
5. **Update this file** if it's a new category

## Documentation Categories

### Getting Started
- QUICK_START.md
- SUMMARY.md

### Reference
- API_REFERENCE.md
- DESIGN_SYSTEM.md
- EDGE_FUNCTIONS_SETUP.md

### Status & Planning
- IMPLEMENTATION_STATUS.md
- CHANGELOG.md
- FCC_Test_Lab_PRD_v1.2.md

### Guides
- IMPLEMENTATION_GUIDE.md
- SHARED_PATTERNS_FROM_OTHER_PROJECTS.md

### Troubleshooting
- CORS Error.md
- (Add more as needed)

## Review Schedule

- **Weekly**: Check IMPLEMENTATION_STATUS.md for accuracy
- **Per Release**: Update CHANGELOG.md, SUMMARY.md
- **Per Major Change**: Review all relevant docs
- **Quarterly**: Full documentation review

## Common Tasks

### Adding a New Feature
1. Update IMPLEMENTATION_STATUS.md
2. Add to CHANGELOG.md
3. Update API_REFERENCE.md if APIs changed
4. Update relevant guides if process changed

### Fixing a Bug
1. Add to CHANGELOG.md
2. Update IMPLEMENTATION_STATUS.md if it was a known issue
3. Add troubleshooting doc if it's a common issue

### Deploying Edge Functions
1. Update EDGE_FUNCTIONS_SETUP.md
2. Update API_REFERENCE.md
3. Add to CHANGELOG.md

### Changing Design Patterns
1. Update DESIGN_SYSTEM.md
2. Update SHARED_PATTERNS_FROM_OTHER_PROJECTS.md
3. Update IMPLEMENTATION_GUIDE.md if needed

## Keeping Links Updated

When moving or renaming files:
1. Update all references in docs/README.md
2. Update SUMMARY.md if referenced
3. Update DOCUMENTATION.md if referenced
4. Search for other references: `grep -r "filename" docs/`

## Documentation Quality

### Good Documentation
- ✅ Clear and concise
- ✅ Up-to-date with code
- ✅ Includes examples
- ✅ Well-organized
- ✅ Easy to find

### Poor Documentation
- ❌ Outdated information
- ❌ Missing examples
- ❌ Unclear explanations
- ❌ Broken links
- ❌ Hard to navigate

## Tools

### Checking Links
```bash
# Find broken links (manual check)
grep -r "\.md" docs/ | grep -v "^docs/"
```

### Finding References
```bash
# Find all references to a file
grep -r "FILENAME" docs/
```

### Updating Dates
```bash
# Find "Last Updated" lines
grep -r "Last Updated" docs/
```

## Notes

- Documentation should be as important as code
- Outdated docs are worse than no docs
- When in doubt, update the docs
- Ask team members to review major doc changes

---

**Remember**: Good documentation makes the project easier to maintain and onboard new developers.

