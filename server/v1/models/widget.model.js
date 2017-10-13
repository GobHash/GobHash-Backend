import mongoose from 'mongoose';

/**
 * Widget Schema
 */
const WidgetSchema = new mongoose.Schema({
  data: [
    []
  ],
  definition: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    widgetType: {
      id: {
        type: Number
      },
      name: {
        type: String
      }
    },
    entity: {
      id: {
        type: Number
      },
      name: {
        type: String
      },
      visible: {
        type: Boolean
      },
      updatedAt: {
        type: Date
      },
      createdAt: {
        type: Date
      }
    },
    filters: [{
      hashKey: {
        type: String
      },
      column: {
        base_table: {
          type: String
        },
        entity_id: {
          type: Number
        },
        name: {
          type: String
        },
        column_type: {
          type: Number
        },
        updatedAt: {
          type: Date
        },
        createdAt: {
          type: Date
        }
      },
      operation: {
        id: {
          type: Number
        },
        name: {
          type: String
        },
        value_type: {
          type: Number
        },
        updatedAt: {
          type: Date
        },
        createdAt: {
          type: Date
        }
      }
    }],
    dateFilters: [{
      hashKey: {
        type: String
      },
      column: {
        base_table: {
          type: String
        },
        entity_id: {
          type: Number
        },
        name: {
          type: String
        },
        column_type: {
          type: Number
        },
        updatedAt: {
          type: Date
        },
        createdAt: {
          type: Date
        }
      },
      operation: {
        id: {
          type: Number
        },
        name: {
          type: String
        },
        value_type: {
          type: Number
        },
        updatedAt: {
          type: Date
        },
        createdAt: {
          type: Date
        }
      }
    }],
    baseColumn: {
      id: {
        type: Number
      },
      name: {
        type: String
      },
      base_type: {
        type: String
      },
      base_table: {
        type: String
      },
      second_table: {
        type: String
      },
      entity_id: {
        type: Number
      },
      createdAt: {
        type: Date
      },
      updatedAt: {
        type: Date
      }
    },
    category: {
      operation: {
        id: {
          type: Number
        },
        name: {
          type: String
        },
        operation_type: {
          type: String
        },
        value_type: {
          type: Number
        },
        createdAt: {
          type: Date
        },
        updatedAt: {
          type: Date
        }
      },
      column: {
        id: {
          type: Number
        },
        name: {
          type: String
        },
        display_name: {
          type: String
        },
        column_type: {
          type: Number
        },
        base_table: {
          type: String
        },
        second_table: {
          type: String
        },
        entity_id: {
          type: Number
        },
        createdAt: {
          type: Date
        },
        updatedAt: {
          type: Date
        }
      }
    },
  }
});


export default mongoose.model('Widget', WidgetSchema);
