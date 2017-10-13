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
        type: {
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
      },
      value: {
        type: String
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
        type: {
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
      },
      value: {
        type: String
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
        type: String
      },
      column: {
        type: String
      }
    },
  }
});


export default mongoose.model('Widget', WidgetSchema);
