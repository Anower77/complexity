# Diagram Studio: Complexity (v1.0.4)

## 1. Overview & Inspiration

Diagram Studio is a first-class engineering diagram creation workspace built directly into Complexity. Inspired by the clean, approachable usability of Excalidraw, it is tailored specifically for software engineers, backend architects, and systems designers.

It runs 100% in the browser with zero login requirements, zero cloud latency, and full privacy.

---

## 2. Workspace Layout

The editor provides a distraction-free, 4-quadrant layout:

```
+---------------------------------------------------------------------------------------+
|  TOP TOOLBAR: Name | Undo/Redo | Zoom | Export (PNG/SVG/JSON) | Import | Templates    |
+----------+----------------------------------------------------------------+-----------+
|  LEFT    |                                                                |   RIGHT   |
|  TOOL-   |                        MAIN CANVAS                             |  PROPERTIES
|  BAR     |                                                                |   PANEL   |
|          |  - Infinite / Pannable Coordinate Space                        |           |
|  Select  |  - Architectural Grid (Dot / Line / None)                      | - Stroke  |
|  Pan     |  - Snap to Grid Option                                         | - Fill    |
|  Shapes  |  - Drag & Drop Component Nodes                                 | - Opacity |
|  Connect |  - Connection Arrow Dragging with Anchor Ports                 | - Width   |
|  Text    |  - Multi-select & Resizing Handles                             | - Text Sz |
|  Eraser  |  - Realtime SVG Vector Rendering                               | - Align   |
|  --------|                                                                | - Order   |
|  SYSTEMS |                                                                | - Delete  |
|  PALETTE |                                                                |           |
+----------+----------------------------------------------------------------+-----------+
```

---

## 3. Toolbars & Controls

### 3.1 Top Toolbar
- **Diagram Title**: Inline editable diagram name (e.g., `Payment Gateway Architecture`).
- **Undo / Redo**: History stack management with keyboard shortcuts (`Ctrl+Z`, `Ctrl+Y`).
- **Zoom In / Out / Reset**: Canvas scaling from 25% to 300% (`Ctrl+=`, `Ctrl+-`, `Ctrl+0`).
- **Export Menu**:
  - Export High-Resolution PNG (transparent or with canvas background).
  - Export Scalable Vector SVG.
  - Export Diagram JSON (full editable document).
- **Import JSON**: Upload and restore previous diagram JSON files.
- **Templates Menu**: Instant loading of 8 production architecture templates.
- **Theme Sync**: Inherits platform dark/light theme with manual toggle.

### 3.2 Left Toolbar & Systems Palette
1. **General Tools**:
   - `Select`: Select, move, and resize elements.
   - `Hand / Pan`: Drag canvas viewport (or hold `Space` + drag).
   - `Rectangle`: Standard box container.
   - `Rounded Rectangle`: Process / service container.
   - `Ellipse`: State / start / endpoint.
   - `Diamond`: Decision / routing branch.
   - `Arrow / Connector`: Directed connection line with arrowheads.
   - `Line`: Simple divider or bus line.
   - `Text`: Freeform text label with customizable font size.
   - `Eraser`: Click to delete element.

2. **Engineering Systems Shapes**:
   - `Client / Browser`: Client device or browser endpoint.
   - `API Gateway`: Reverse proxy / gateway layer.
   - `Load Balancer`: Layer 4/7 load distribution.
   - `App Server`: Backend compute instance / microservice.
   - `Database`: Persistent relational / document store.
   - `Redis Cache`: In-memory key-value cache.
   - `Message Queue`: Distributed event broker / topic.
   - `Docker Container`: Containerized execution boundary.
   - `Kubernetes Pod`: Pod grouping multiple containers.
   - `Cloud / VPC`: Cloud perimeter boundary.
   - `Network Boundary`: Dotted boundary for subnets / zones.

### 3.3 Right Properties Panel
- **Selected Element Label**: Direct text label input.
- **Fill Color**: Palette of 8 editorial colors (Canvas, Slate, Blue, Mint, Amber, Rose, Purple, Transparent).
- **Stroke Color**: High-contrast border color options.
- **Stroke Width**: `1px`, `2px`, `3px`, `4px`.
- **Stroke Style**: Solid, Dashed, Dotted.
- **Opacity**: 100%, 80%, 50%, 25%.
- **Font Size**: Small (`12px`), Medium (`14px`), Large (`18px`), Extra-Large (`24px`).
- **Text Alignment**: Left, Center, Right.
- **Layer Ordering**: Bring Forward (`Ctrl+]`), Send Backward (`Ctrl+[`).
- **Actions**: Duplicate (`Ctrl+D`), Delete (`Delete` / `Backspace`).

---

## 4. Architecture Starter Templates

Diagram Studio includes 8 pre-crafted, editable architecture templates:
1. **Three-Tier Web Application**: Client -> Load Balancer -> App Servers -> Primary & Replica DBs + Redis Cache.
2. **Client-Server Architecture**: Browser Client -> DNS -> Gateway -> Backend Server.
3. **Load-Balanced High-Availability Backend**: Multi-zone ALB routing traffic across redundant compute nodes.
4. **Microservices Architecture**: API Gateway -> Auth Service, Order Service, Catalog Service with gRPC interconnect.
5. **Event-Driven Architecture**: Event Producers -> Kafka Message Queue -> Consumer Groups & Audit Workers.
6. **Database Replication & Failover**: Write Master node with asynchronous replication to dual Read Replicas.
7. **Redis Cache-Aside Pattern**: Application querying Cache first, falling back to Database on miss.
8. **Kubernetes Multi-Tier Deployment**: Ingress -> ClusterIP Service -> Pod ReplicaSet on Worker Nodes.

---

## 5. Storage & Draft Recovery

- **Zero Cloud Requirement**: No login, no backend API needed.
- **Local Persistence**: Diagrams are automatically saved to `localStorage` under key `complexity_diagram_draft`.
- **Portability**: Diagram JSON files are lightweight and easily version-controlled in Git.
