# Supabase MCP Server

A Model Context Protocol (MCP) server that provides tools for interacting with a Supabase database. This server enables AI assistants to perform database operations through a standardized interface.

NOTE: This is a fork of the original Supabase MCP server with added npm support to allow running without Docker.

## Features

- **Read Table Rows**: Query data from Supabase tables with optional filtering, pagination, and column selection
- **Create Table Records**: Insert new records into Supabase tables
- **Update Table Records**: Modify existing records in Supabase tables based on filters
- **Delete Table Records**: Remove records from Supabase tables based on filters

## Prerequisites

- Docker (for Docker setup) OR Node.js ≥ 14 and Python ≥ 3.9 (for npm setup)
- Supabase account and project

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Simlalo/supabase-mcp.git
   cd supabase-mcp
   ```

2. Set up your environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

### Docker Setup

1. Build the Docker image:
   ```bash
   docker build -t mcp/supabase .
   ```

### npm Setup

1. Install Node.js dependencies:
   ```bash
   npm install
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

### Running as an MCP Server with Docker

The Supabase MCP server can be integrated with AI assistants using the Model Context Protocol.

1. Include the below configuration in your MCP config (in Claude Desktop, Windsurf, etc.)

Be sure to build the container with the installation steps first!

```json
{
  "mcpServers": {
    "supabase": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "-e", "SUPABASE_URL", "-e", "SUPABASE_SERVICE_KEY", "mcp/supabase"],
      "env": {
        "SUPABASE_URL": "YOUR-SUPABASE-URL",
        "SUPABASE_SERVICE_KEY": "YOUR-SUPABASE-SERVICE-ROLE-KEY"
      }
    }
  }
}
```

### Running as an MCP Server with npm

You can also run the Supabase MCP server using npm:

1. Include the below configuration in your MCP config:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/path/to/supabase-mcp",
      "env": {
        "SUPABASE_URL": "YOUR-SUPABASE-URL",
        "SUPABASE_SERVICE_KEY": "YOUR-SUPABASE-SERVICE-ROLE-KEY"
      }
    }
  }
}
```

### Running as an MCP Server with Node.js directly

Alternatively, you can run the server directly with Node.js:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["index.js"],
      "cwd": "/path/to/supabase-mcp",
      "env": {
        "SUPABASE_URL": "YOUR-SUPABASE-URL",
        "SUPABASE_SERVICE_KEY": "YOUR-SUPABASE-SERVICE-ROLE-KEY"
      }
    }
  }
}
```

Replace `YOUR-SUPABASE-URL` and `YOUR-SUPABASE-SERVICE-ROLE-KEY` with your actual Supabase credentials.

The AI assistant can now access the Supabase database through the MCP server using the provided tools.

For more information on the Model Context Protocol, visit [modelcontextprotocol.io](https://modelcontextprotocol.io).

### Available Tools

#### Read Table Rows

```python
read_table_rows(
    table_name: str,
    columns: Optional[List[str]] = None,
    filters: Optional[Dict[str, Any]] = None,
    limit: Optional[int] = None,
    offset: Optional[int] = None
)
```

Example:
```python
# Read active users
read_table_rows(
    table_name="users",
    columns=["id", "name", "email"],
    filters={"is_active": True},
    limit=10,
    offset=0
)
```

#### Create Table Records

```python
create_table_records(
    table_name: str,
    records: Union[Dict[str, Any], List[Dict[str, Any]]]
)
```

Example:
```python
# Create a new user
create_table_records(
    table_name="users",
    records={
        "name": "John Doe",
        "email": "john@example.com",
        "is_active": True
    }
)
```

#### Update Table Records

```python
update_table_records(
    table_name: str,
    updates: Dict[str, Any],
    filters: Dict[str, Any]
)
```

Example:
```python
# Update user status
update_table_records(
    table_name="users",
    updates={"status": "premium"},
    filters={"is_active": True}
)
```

#### Delete Table Records

```python
delete_table_records(
    table_name: str,
    filters: Dict[str, Any]
)
```

Example:
```python
# Delete inactive users
delete_table_records(
    table_name="users",
    filters={"is_active": False}
)
```

## Development

### Project Structure

```
supabase-mcp/
├── supabase_mcp/
│   ├── __init__.py
│   ├── server.py              # Main MCP server implementation
│   └── tests/                 # Unit tests
├── Dockerfile                 # Docker configuration for MCP server
├── index.js                   # Node.js wrapper for npm/Node.js usage
├── package.json               # npm package configuration
├── example_mcp_config.json    # Example MCP configuration
├── requirements.txt           # Python dependencies
├── .env.example               # Example environment variables
├── README.md                  # Project documentation
├── PLANNING.md                # Project planning
└── TASKS.md                   # Task tracking
```

### Running Tests

```bash
pytest supabase_mcp/tests/
```

## Model Context Protocol Integration

The Supabase MCP server implements the [Model Context Protocol](https://modelcontextprotocol.io), which allows AI assistants to interact with Supabase databases in a standardized way.

### How It Works

1. The MCP server exposes tools for database operations (read, create, update, delete)
2. AI assistants connect to the MCP server using the stdio transport
3. The AI assistant can invoke the tools to perform database operations
4. The MCP server handles the communication with Supabase and returns the results

### MCP Configuration Options

The `example_mcp_config.json` file shows different ways to configure an AI assistant to use the Supabase MCP server:

#### Docker Configuration

```json
{
  "mcpServers": {
    "supabase": {
      "command": "docker",
      "args": ["run", "--rm", "-i", "-e", "SUPABASE_URL", "-e", "SUPABASE_SERVICE_KEY", "mcp/supabase"],
      "env": {
        "SUPABASE_URL": "YOUR-SUPABASE-URL",
        "SUPABASE_SERVICE_KEY": "YOUR-SUPABASE-SERVICE-ROLE-KEY"
      }
    }
  }
}
```

#### npm Configuration

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npm",
      "args": ["start"],
      "cwd": "/path/to/supabase-mcp",
      "env": {
        "SUPABASE_URL": "YOUR-SUPABASE-URL",
        "SUPABASE_SERVICE_KEY": "YOUR-SUPABASE-SERVICE-ROLE-KEY"
      }
    }
  }
}
```

#### Node.js Configuration

```json
{
  "mcpServers": {
    "supabase": {
      "command": "node",
      "args": ["index.js"],
      "cwd": "/path/to/supabase-mcp",
      "env": {
        "SUPABASE_URL": "YOUR-SUPABASE-URL",
        "SUPABASE_SERVICE_KEY": "YOUR-SUPABASE-SERVICE-ROLE-KEY"
      }
    }
  }
}
```

Choose the configuration that best fits your environment and preferences.

### Using with AI Assistants

AI assistants that support the Model Context Protocol can use this server to:

1. Query data from Supabase tables
2. Insert new records into tables
3. Update existing records
4. Delete records

The assistant will have access to the tools documented in the "Available Tools" section above.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | URL of your Supabase project |
| `SUPABASE_SERVICE_KEY` | Service role key for Supabase authentication |

## Changes from Original Repository

This fork adds the following features to the original repository:

- **npm Support**: Run the MCP server using npm instead of requiring Docker
- **Node.js Wrapper**: A JavaScript wrapper script to run the Python MCP server
- **Updated Documentation**: Instructions for both Docker and npm setups
- **Multiple Configuration Options**: Example configurations for Docker, npm, and Node.js

## License

This project is licensed under the MIT License - see the LICENSE file for details.