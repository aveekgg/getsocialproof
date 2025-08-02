# 🤝 Contributing to RoomReel Challenge

Thank you for your interest in contributing to RoomReel Challenge! We're excited to have you join our community of developers working to help students share authentic living experiences.

## 🌟 Ways to Contribute

- 🐛 **Bug Reports** - Help us identify and fix issues
- ✨ **Feature Requests** - Suggest new functionality
- 💻 **Code Contributions** - Submit bug fixes and new features
- 📚 **Documentation** - Improve our docs and guides
- 🎨 **Design** - Enhance UI/UX and visual elements
- 🧪 **Testing** - Help us maintain quality and reliability

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

- **Node.js 18+** installed
- **Git** for version control
- A **GitHub account**
- Basic knowledge of **React**, **TypeScript**, and **Tailwind CSS**

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/getsocialproof.git
   cd getsocialproof
   ```

2. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/aveekgg/getsocialproof.git
   ```

3. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client && npm install && cd ..
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Verify setup**
   - Open http://localhost:5000
   - Ensure the app loads correctly
   - Test basic functionality (browse challenges, login modal)

## 📋 Development Workflow

### Branch Strategy

- **main** - Production-ready code
- **feature/feature-name** - New features
- **fix/bug-description** - Bug fixes
- **docs/update-description** - Documentation updates

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow our coding standards (see below)
   - Write clear, descriptive commit messages
   - Test your changes thoroughly

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new challenge type selection"
   ```

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Use our PR template
   - Provide clear description of changes
   - Include screenshots for UI changes
   - Link related issues

## 📝 Coding Standards

### TypeScript Guidelines

- **Use TypeScript** for all new code
- **Define interfaces** for component props and data structures
- **Avoid `any` type** - use proper typing
- **Export types** from `client/src/types/index.ts`

```typescript
// ✅ Good
interface ChallengeProps {
  title: string;
  description: string;
  points: number;
}

// ❌ Avoid
const challenge: any = { ... };
```

### React Component Standards

- **Use functional components** with hooks
- **Follow naming conventions**: PascalCase for components
- **Keep components focused** - single responsibility
- **Use custom hooks** for reusable logic

```typescript
// ✅ Good component structure
interface ChallengeCardProps {
  challenge: Challenge;
  onSelect: (id: string) => void;
}

export function ChallengeCard({ challenge, onSelect }: ChallengeCardProps) {
  return (
    <div className="challenge-card">
      {/* Component content */}
    </div>
  );
}
```

### Styling Guidelines

- **Use Tailwind CSS** for styling
- **Follow mobile-first** approach
- **Use design system colors** and spacing
- **Implement outlined button pattern** with hover effects

```typescript
// ✅ Good styling pattern
<button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
  Select Challenge
</button>
```

### File Organization

```
client/src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI primitives
│   └── [Component].tsx # Feature components
├── pages/              # Page-level components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── types/              # TypeScript definitions
└── styles/             # Global styles
```

## 🧪 Testing Guidelines

### Manual Testing Checklist

Before submitting a PR, test:

- ✅ **Mobile responsiveness** (iPhone, Android)
- ✅ **Desktop compatibility** (Chrome, Firefox, Safari)
- ✅ **Authentication flow** (login/logout)
- ✅ **Challenge selection** and recording
- ✅ **Reward wheel** functionality
- ✅ **Navigation** between screens

### Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Mobile Safari** iOS 14+
- **Chrome Mobile** Android 10+

## 🎨 Design Guidelines

### UI/UX Principles

- **Mobile-first** design approach
- **Clean, spacious** layouts with proper whitespace
- **Outlined buttons** with theme color fill on hover
- **Consistent spacing** using Tailwind's scale
- **Accessible** color contrast and focus states

### Color Palette

```css
/* Primary Colors */
--blue-600: #2563eb;
--purple-600: #9333ea;
--indigo-700: #4338ca;

/* Accent Colors */
--green-500: #10b981;
--red-500: #ef4444;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-900: #111827;
```

### Component Patterns

- **Cards**: Rounded corners with subtle shadows
- **Modals**: Backdrop blur with glassmorphism
- **Buttons**: Outlined style with hover fill
- **Forms**: Clean inputs with proper validation states

## 📚 Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/) for clear commit history:

### Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```bash
feat(auth): add social login options
fix(camera): resolve recording permission issue
docs(readme): update installation instructions
style(components): improve button hover animations
```

## 🔍 Pull Request Guidelines

### PR Template

When creating a PR, include:

```markdown
## 📋 Description
Brief description of changes made.

## 🎯 Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## 🧪 Testing
- [ ] Tested on mobile devices
- [ ] Tested on desktop browsers
- [ ] Manual testing completed
- [ ] No console errors

## 📱 Screenshots
Include screenshots for UI changes.

## 📝 Additional Notes
Any additional context or considerations.
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** on multiple devices
4. **Approval** from at least one maintainer
5. **Merge** to main branch

## 🐛 Bug Reports

### Before Reporting

- Check existing issues for duplicates
- Test on multiple browsers/devices
- Gather reproduction steps

### Bug Report Template

```markdown
## 🐛 Bug Description
Clear description of the bug.

## 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## 💭 Expected Behavior
What should happen.

## 📱 Environment
- Device: [iPhone 12, MacBook Pro, etc.]
- Browser: [Chrome 96, Safari 15, etc.]
- OS: [iOS 15, macOS 12, etc.]

## 📸 Screenshots
Include screenshots if applicable.
```

## ✨ Feature Requests

### Feature Request Template

```markdown
## 🚀 Feature Description
Clear description of the proposed feature.

## 🎯 Problem Statement
What problem does this solve?

## 💡 Proposed Solution
How should this feature work?

## 🎨 Design Considerations
Any UI/UX considerations.

## 📱 User Impact
How will this benefit users?
```

## 🏆 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub discussions** for community highlights

## 📞 Getting Help

Need help contributing? Reach out:

- 💬 **GitHub Discussions** - Ask questions and get help
- 🐛 **GitHub Issues** - Report bugs or request features
- 📧 **Email** - [your-email@example.com](mailto:your-email@example.com)

## 📄 Code of Conduct

### Our Standards

- **Be respectful** and inclusive
- **Provide constructive** feedback
- **Focus on the code**, not the person
- **Help others** learn and grow
- **Maintain professionalism** in all interactions

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal attacks
- Publishing private information
- Spam or off-topic content

## 📜 License

By contributing to RoomReel Challenge, you agree that your contributions will be licensed under the MIT License.

---

<div align="center">
  <p><strong>Thank you for contributing to RoomReel Challenge! 🎉</strong></p>
  <p>Together, we're helping students find their perfect home through authentic stories.</p>
</div>