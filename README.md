# KineticMesh - VM Management Panel

An open-source, web-based Virtual Machine Management Panel for QEMU & KVM.

---

## Features

- **Virtual Machine Management**: Create, edit, start, stop, pause, and delete VMs.
- **Hardware Customization**: Full support for CPU models (`host`, `epyc`, `skylake`, `corei7`, etc.), machine architectures (`q35`, `pc`, `virt`, `microvm`), RAM, and vCPU allocation.
- **Web Console & Terminal**:
  - Interactive WebSocket-based Web VNC / Console
  - In-browser interactive SSH terminal
- **Networking**: Support for User-Mode NAT with automatic port-forwarding and Static Public IPv4 bridge networking.
- **Image & Template Library**: Management for ISO installation images and pre-configured CloudVM images.
- **Role-Based Access Control**: Separate views and permissions for Administrators and standard Users.
- **Authentication**: Local database credentials with bcrypt hashing and optional Discord OAuth integration.
- **Standalone & Self-Hosted**: 100% open-source with no external DRM or license verification servers required.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [QEMU / KVM](https://www.qemu.org/) (installed on host system for virtualization)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/xAyan55/KineticMesh.git
   cd KineticMesh
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

---

## Default Administrator Credentials

Upon initial startup, the database creates a default administrative account:

- **Username**: `admin`
- **Password**: `admin`

> **Note**: Make sure to change the default password after your first login via the Admin Settings or Profile page.

---

## License

This project is licensed under the [MIT License](LICENSE).
